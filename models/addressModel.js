const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    landmark: {
        type: String,
        required: true,
    },
    village: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    houseNo: {
        type: String,
        required: true,
    },
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
