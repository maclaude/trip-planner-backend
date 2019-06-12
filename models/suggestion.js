/**
 * NPM import
 */
const mongoose = require('mongoose');

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
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    suggestion_gender: {
      type: Schema.Types.ObjectId,
      ref: 'Suggestion_gender',
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
