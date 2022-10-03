const mongoose = require("mongoose");
let CartModelSch = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        price: { type: Number },
        count: { type: Number }
    }
);

let CartModel = mongoose.model('Cart', CartModelSch);

module.exports = { CartModel }