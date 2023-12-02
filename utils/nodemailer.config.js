const nodemailer = require('nodemailer');
require('dotenv').config();

const config = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail email address
    pass: process.env.EMAIL_PASSWORD, // your Gmail passwod
  },
}

const transporter = nodemailer.createTransport(config);

const sendOrderConfirmationEmail = async (email, savedOrder, totalAmount, fullAddress) => {
  try {
    const message = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Order Placed Successfully',
      html: `
        <h1>Your Order Details</h1>
        <p>Thank you for placing an order with us. Your order ID is ${savedOrder._id}.</p>
        <p>Details:</p>
        <ul>
          <li>Total Amount: ${totalAmount}</li>
          <li>Status: ${savedOrder.status}</li>
          <!-- Add more details as needed -->
        </ul>
        <p>Shipping Address: ${fullAddress}</p>
      `,
    }

    await transporter.sendMail(message);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw new Error('Error sending email');
  }
};


const orderStatusChange = async (email, status) => {
  try {
    const message = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your order status has been changed',
      html: `
        <h1>Your status change to ${status}</h1>
      `,
    }
    await transporter.sendMail(message);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending order status change email:', error);
    throw new Error('Error sending email');
  }
};

module.exports = { sendOrderConfirmationEmail, orderStatusChange };