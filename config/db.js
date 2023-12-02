const mongoose = require('mongoose');

const dbConnect = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/auth");
}

module.exports = dbConnect