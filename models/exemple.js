/**
 * NPM import
 */
const mongoose = require('mongoose');

/**
 * Code
 */
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

/**
 * Export
 */
module.exports = mongoose.model('User', userSchema);
