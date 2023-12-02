const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true, // Make the 'name' field required
    unique: true, // Ensure uniqueness of category names
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
