const express = require('express');
const Product = require('../models/productModel');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs=require('fs');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
const upload = multer({ dest: 'uploads/' });
// app.use(upload.array('images'));

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category')
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


const getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}; 

const searchProduct=async(req,res)=>{
    const { query } = req.query;
    try {
        const results = await Product.find({
            $or: [
              { name: { $regex: query, $options: 'i' } },
            ],
        })
        res.json(results);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

// Create a new product
const createProduct = (upload.array('images'), async (req, res) => {
    try {
        const { name, description, price,category,slug } = req.body;
        const imageUrls = [];
        // Upload images to Cloudinary
        const promises = req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path);
            imageUrls.push(result.secure_url);
        });

        await Promise.all(promises);

        // Create a new product instance
        const newProduct = new Product({
            name,
            description,
            price,
            images: imageUrls,
            category,
            slug
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();
        
        req.files.forEach((file) => {
            fs.unlinkSync(file.path);
        });
 
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    searchProduct
}; 