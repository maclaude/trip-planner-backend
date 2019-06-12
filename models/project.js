/**
 * NPM import
 */
const mongoose = require('mongoose');

/**
 * Code
 */
const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    decription: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    Suggestions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Suggestion',
      },
    ],
    Dates: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Dates',
      },
    ],
  },
  // createdAt - updatedAt
  { timestamps: true }
);

/**
 * Export
 */
module.exports = mongoose.model('Project', projectSchema);
