const mongoose = require('mongoose');
const { local } = require('../local');

const userSchema = new mongoose.Schema({
  username: {type: String, require: [true, local.required], unique: [true, local.taken]},
  email: {
    type: String,
    required: [true, local.required],
    trim: true,
    unique: [true, local.taken],
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  },
  resetToken: {type: String}, 
  resetTokenExpires: {type: Date},
  name: {type: String, require: [true, local.required]},
  password: {type: String, require: [true, local.taken]}
});

module.exports = mongoose.model('User', userSchema);