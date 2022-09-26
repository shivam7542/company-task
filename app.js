const express = require('express');
const mongoConnection = require('./model/databaseConnection');
const app = express()
const port = 9000
const path = require('path');
mongoConnection();
app.use(express.json());
app.use('/public/images', express.static(path.join('public', 'images')));

const { productsRouter, productRouter } = require('./router/productRouter');

app.use('/products', productsRouter);
app.use('/product', productRouter);
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