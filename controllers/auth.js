// Auth controller

/**
 * NPM import
 */
const bcrypt = require('bcryptjs');

/**
 * Local import
 */
// Models
const User = require('../models/user');

/**
 * Code
 */
exports.signup = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    // Encrypting password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Creating new user
    const newUser = await new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    const response = await newUser.save();

    // Sending the response to the client
    res.status(201).json({ message: 'User created', userId: response._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    // Next to reach the error middleware
    next(err);
  }
};

exports.login = (req, res, next) => {};
