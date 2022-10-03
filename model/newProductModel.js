const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: { type: String },
    category: { type: String },
    price: { type: Number },
    discount: { type: Number },
    stockItemCount: { type: Number },
    qtyInput: {
        default: 0,
        type: Number
    }
});

let NewProductModel = mongoose.model('Product', ProductSchema);
module.exports = { NewProductModel };
