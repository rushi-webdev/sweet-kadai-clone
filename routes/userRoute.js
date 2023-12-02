const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET_KEY;


router.post('/register', async (req, res) => {
  const { email, password, firstname, lastname, phone } = req.body;
  try {
    const emailUser = await User.findOne({ email });
    if (emailUser) {
      return res.status(400).json({ message: 'Email is already exists' });
    }
    const phoneUser = await User.findOne({ phone });
    if (phoneUser) {
      return res.status(400).json({ message: 'Phone is already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, firstname, lastname, phone });
    await newUser.save();
    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Verify user credentials (you can use bcrypt to compare hashed passwords)
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);

  // Generate a JWT token
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = jwt.sign({ userId: user._id, email: user.email, phone: user.phone }, secretKey, {
    expiresIn: '1h', // Token expiration time
  });
  const isAdmin = user.isAdmin;
  res.status(200).json({ token, userId: user._id, isAdmin });
});


router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      // Add other user properties as needed
    };
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  // Generate a unique token
  const token = crypto.randomBytes(20).toString('hex');

  const user = await User.findOneAndUpdate({ email }, { resetToken: token });
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // your Gmail email address
        pass: process.env.EMAIL_PASSWORD, // your Gmail password
      },
    });

    // Setup email data
    const mailOptions = {
      from: process.env.EMAIL_USER, // sender address
      to: email, // list of receivers
      subject: 'Password Reset',
      text: `To reset your password, click the following link: ${process.env.FRONT_ROUTE}/${token}`
      // html: "<b>Hello, this is a test email from Nodemailer!</b>", // html body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Please try again later!' });
      }
      res.json({ message: 'Email sent successfully' });
    });
  } catch (error) {
    console.log(error)
  }

});


router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  // Find the user with the provided token
  const user = await User.findOne({ resetToken: token });
  if (!user) {
    return res.status(404).json({ message: 'Invalid or expired token' });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetToken = null;
  await user.save();
  res.status(200).json({ message: 'Password reset successful' });
});

router.put('/update', async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  const updatedData = req.body;

  try {
    const user = await User.findById(userId);

    if (oldPassword && newPassword) {
      if (oldPassword === newPassword) {
        return res.json({ success: false, message: 'Please provide a different password' });
      } else {
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!passwordMatch) {
          return res.json({ success: false, message: 'Wrong Password entered' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
      }
    }

    // Update other fields in updatedData as needed
    // Note: You might want to selectively update fields rather than updating everything
    Object.assign(user, updatedData);

    // Use user.save() instead of findByIdAndUpdate to trigger middleware
    const updatedUser = await user.save();

    return res.json({ success: true, message: 'User information updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



module.exports = router;
