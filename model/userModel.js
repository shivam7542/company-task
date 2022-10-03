const mongoose = require("mongoose");


const UserModelSch = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    city: { type: String },
    country: { type: String },
    phoneNumber: { type: Number },
    wallet: { type: Number },
    photoUrl: { type: String },
    token: { type: String, default: "" }
}, { timestamps: true });

let userModel = mongoose.model('User', UserModelSch);

module.exports = { userModel }