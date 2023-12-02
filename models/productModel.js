const mongoose = require('mongoose');

// Define the User Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type: [String]
    },
    description: {
        type: String
    },
    slug: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    // product_type:{
    //     type:String, 
    //     required:true
    // },
    // ingridients:{
    //     type:String,
    //     required:true
    // },
    // life:{
    //     type:String,
    //     required:true
    // } 
}, { timestamps: true });

productSchema.index({ '$**': 'text' });

// Create the User model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
