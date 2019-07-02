/**
 * NPM import
 */
const mongoose = require('mongoose');

/**
 * Code
 */
const { Schema } = mongoose;

const suggestionTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

/**
 * Export
 */
module.exports = mongoose.model('Suggestion_type', suggestionTypeSchema);
