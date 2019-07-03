/**
 * NPM import
 */
const mongoose = require('mongoose');

/**
 * Local import
 */
// Models
// eslint-disable-next-line no-unused-vars
const SuggestionType = require('./suggestion_type');

/**
 * Code
 */
const { Schema } = mongoose;

const suggestionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    suggestion_type: {
      type: Number,
      ref: 'Suggestion_type',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    user_vote: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  // createdAt - updatedAt
  { timestamps: true }
);

/**
 * Export
 */
module.exports = mongoose.model('Suggestion', suggestionSchema);
