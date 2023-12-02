const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel'); // Import your Order model
const Address = require('../models/addressModel')
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const { sendOrderConfirmationEmail, orderStatusChange } = require('../utils/nodemailer.config');
// Define a route to create a new order

router.post('/orders', async (req, res) => {
  try {
    const {
      user,
      items,
      totalAmount,
      shippingAddress
    } = req.body;

    const userDetails = await User.findById(user);
    const addressDetails = await Address.findById(shippingAddress);
    const fullAddress = `${addressDetails.houseNo}, ${addressDetails.landmark}, ${addressDetails.village}, ${addressDetails.district},${addressDetails.state},${addressDetails.pincode}`;

    const email = userDetails.email;
    const newOrder = new Order({
      user,
      items,
      totalAmount,
      shippingAddress
    });
    const savedOrder = await newOrder.save();

    await sendOrderConfirmationEmail(email, savedOrder, totalAmount, fullAddress);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

router.post('/order/:id',async(req,res)=>{
  const {id}=req.params;
  const order=await Order.findById(id).populate('shippingAddress').populate("items.product").populate('user');
  if(!order){
    res.status(400).json({message:"No order found !"})
  }
  res.status(201).json(order);
})

router.get('/orders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const usersWithoutPasswords = await User.find({}, '-password -isAdmin');
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.log(error)
  }
})

router.post('/address/orderAddress', async (req, res) => {
  const { orderId } = req.body;
  try {
    const address = await Address.findById(orderId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found for the specified order ID' });
    }
    res.json(address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params
    const newStatus = req.body.status; // Assuming the new status is provided in the 
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true } // Return the updated order
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const userId = updatedOrder.user;
    const userIdString = userId.toString();
    const user = await User.findById(userIdString);
    await orderStatusChange(user.email, newStatus);
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

router.post('/admin/:id', async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate('shippingAddress')
    .populate('user')
    .populate('items.product', 'name description price images')

  if (!order) {
    res.send(400).json({ message: "This order is not found" })
  }
  res.send(order);
});

module.exports = router;
