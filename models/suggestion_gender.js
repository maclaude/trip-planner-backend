/**
 * NPM import
 */
const mongoose = require('mongoose');

/**
 * Code
 */
const { Schema } = mongoose;

const suggestionGenderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

/**
 * Export
 */
module.exports = mongoose.model('Suggestion_gender', suggestionGenderSchema);
