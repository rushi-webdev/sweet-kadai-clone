const mongoose = require('mongoose');
const bcrypt=require('bcrypt')
// Define the User Schema
const userSchema = new mongoose.Schema({
  firstname:{
    type:String,
    required:true
  },
  lastname:{
    type:String,
    required:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  resetToken:{
    type:String,
    default:null
  }
},{timestamps:true});

// Create the User model
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
