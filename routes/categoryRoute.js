// categoryController.js
const express = require('express');
const router = express.Router();
const Category = require('../models/categoryModel');
const Product=require('../models/productModel')

router.post('/category', async (req, res) => {
  const { name } = req.body;
  try {
    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json("Category already exists");
    }
    console.log("first")
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json("Category Added Successfully");
  } catch (error) { 
    console.error('Error creating category:', error);
    res.status(500).send('Internal Server Error');
  }
})

router.get('/get-categories',async(req,res)=>{
    try {
        const categories = await Category.find();
        res.json(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

router.get('/category/:id',async(req,res)=>{
    const param=req.params.id;
    const category = await Category.findOne({ name: param })
    const products = await Product.find({ category: category._id });
    res.json(products);
})
 
module.exports = router;