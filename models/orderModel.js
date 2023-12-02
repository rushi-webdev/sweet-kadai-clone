const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user who placed the order
    ref: 'User', // Reference to the "User" model (if you have one)
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the product being ordered
        ref: 'Product', // Reference to the "Product" model (if you have one)
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered"],
    default: "Pending",
  },
});

orderSchema.pre('find', function (next) {
  this.populate('items.product');
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
