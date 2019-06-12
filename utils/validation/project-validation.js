// Project validation

/**
 * NPM import
 */
const { body } = require('express-validator/check');

/**
 * Code
 */
exports.postProject = [
  body('title')
    .trim()
    .not()
    .isEmpty(),
  body('description')
    .trim()
    .not()
    .isEmpty(),
  body('destination')
    .trim()
    .not()
    .isEmpty(),
];
