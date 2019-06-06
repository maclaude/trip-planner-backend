// Auth validation

/**
 * NPM import
 */
const { body } = require('express-validator/check');

/**
 * Local import
 */
// Models
const User = require('../../models/user');

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
    .withMessage('Email address is not valid')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          const error = 'Email address is already used';
          return Promise.reject(error);
        }
        return true;
      });
    }),
  body('password')
    .trim()
    .isLength({ min: 8 }),
];
