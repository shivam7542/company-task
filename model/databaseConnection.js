const mongoose = require('mongoose');
function mongoConnection() {
    mongoose.connect('mongodb+srv://shivam_7542:ShivamK100@cluster0.z3dhk.mongodb.net/?retryWrites=true&w=majority').then((res) => console.log('db connected')).catch((error) => console.log('error', error));
}

module.exports = mongoConnection;