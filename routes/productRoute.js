// routes/products.js
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  searchProduct,
} = require('../controllers/productController');

// Get all products
router.get('/products', getAllProducts);

// Get a product by ID
router.get('/products/:id', getProductById);

// Create a new product
router.post('/products', createProduct);

// search route
router.get('/search', searchProduct);

module.exports = router;
