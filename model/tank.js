const mongoose = require('mongoose');
const TankSchema = new mongoose.Schema({
    name: { type: String },
    category: { type: String },
    price: { type: Number },
    discount: { type: Number },
    stockItemCount: { type: Number }
});
const Tank = mongoose.model('Tank', TankSchema);

module.exports = { Tank }
