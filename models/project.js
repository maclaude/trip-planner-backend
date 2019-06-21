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
    description: {
      type: String,
      required: true,
    },
    destination: {
      name: {
        type: String,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
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
    suggestions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Suggestion',
      },
    ],
    dates: [
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
