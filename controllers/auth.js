// Auth controller

/**
 * NPM import
 */
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Local import
 */
// Models
const User = require('../models/user');

/**
 * Code
 */
exports.signup = async (req, res, next) => {
  // Request validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      'Signup validation failed, entered data is incorrect.'
    );
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { firstname, lastname, email, password } = req.body;

  try {
    // Finding if a user already exists with this email
    const user = await User.findOne({ email });

    // If email address already used, throw an error
    if (user) {
      const error = new Error('Adresse email déjà utilisée');
      error.statusCode = 422;
      throw error;
    }

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

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Finding current user by email & Fetching user's projects data
    const user = await User.findOne({ email }).populate('projects');
    // Throw an error if nothing is retrieved
    if (!user) {
      const error = new Error('Aucun utilisateur trouvé avec cet email');
      error.statusCode = 401;
      throw error;
    }

    // Comparing passwords
    const passwordsMatched = await bcrypt.compare(password, user.password);
    // Throw an error if passwords don't match
    if (!passwordsMatched) {
      const error = new Error('Le mot de passe est incorrect');
      error.statusCode = 404;
      throw error;
    }

    // Generating token
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      'secret',
      { expiresIn: '1h' }
    );

    // Preparing response object
    const response = {
      id: user._id.toString(),
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      avatar: user.avatar || 'default.png',
      projects: user.projects,
    };

    // Sending the response to the client
    res.status(200).json({ token, user: response });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    // Next to reach the error middleware
    next(err);
  }
};
