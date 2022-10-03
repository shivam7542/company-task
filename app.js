const express = require('express');
const mongoConnection = require('./model/databaseConnection');
const app = express()
const port = 9000
const path = require('path');
const { productsRouter, productRouter } = require('./router/productRouter');
const { userRouter } = require('./router/userRouter');
const cors = require('cors');
mongoConnection();
app.use(express.json());
app.use(cors())
app.use('/public/images', express.static(path.join('public', 'images')));


// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

//     next();
// });



app.use('/products', productsRouter);
// app.use('/product', productRouter);
app.use('/user', userRouter)
// Logging the rejected field from multer error
app.use((error, req, res, next) => {
    if (error.message === "Unexpected field") {
        return res.status(403).send({ msg: `We don't expect ${ error.field } field for image upload.` })
    }

    return res.status(500).send({ msg: 'Internel error' })

});

app.listen(port, () => {
    console.log(`Example app listening on port ${ port }`)
})