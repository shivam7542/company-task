const mongoose = require('mongoose');


let TransactionModelSch = new mongoose.Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    price: { type: Number },
    discount: { type: Number },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

}, {
    timestamps: true
})

// const buyProduct = () => {
//     const { userId, productId, qty, } = req.body;
//     await TransactionModel.create({ })
// }


let TransactionModel = mongoose.model('Transation', TransactionModelSch);
module.exports = { TransactionModel } 