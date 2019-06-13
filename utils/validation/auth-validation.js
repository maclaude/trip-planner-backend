// Auth validation

/**
 * NPM import
 */
const { body } = require('express-validator/check');

/**
 * Code
 */
exports.signup = [
  body('firstname')
    .trim()
    .not()
    .isEmpty(),
  body('lastname')
    .trim()
    .not()
    .isEmpty(),
  body('email')
    .isEmail()
    .withMessage('Adresse email non valide'),
  body('password')
    .trim()
    .isLength({ min: 8 }),
];
