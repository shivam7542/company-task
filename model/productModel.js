const mongoose = require('mongoose');

const Products = new mongoose.Schema(
    {
        name: { type: String },
        category: { type: String },
        buyPrice: { type: Number },
        sellPrice: { type: Number },
        thumbnail: { type: String }

    }, { timestamps: true }
);

let taskModel = mongoose.model('productModel', Products);
module.exports = taskModel;


