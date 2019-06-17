// Project controller

/**
 * NPM import
 */
const { validationResult } = require('express-validator/check');

/**
 * Local import
 */
// Models
const Project = require('../models/project');
const User = require('../models/user');

/**
 * Code
 */
exports.postProject = async (req, res, next) => {
  // Request validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      'postProject validation failed, entered data is incorrect.'
    );
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { title, description, destination, lat, lng, userId } = req.body;

  try {
    // Creating the new project
    const newProject = await new Project({
      title,
      description,
      destination: {
        name: destination,
        lat,
        lng,
      },
      creator: userId,
      participants: [userId],
    });
    const response = await newProject.save();

    // Fetching creator user
    const user = await User.findById(userId);
    // Adding the newProject objectId to the user's projects
    user.projects.push(newProject);
    // Saving the updated user
    await user.save();

    // Sending the response to the client
    res.status(201).json({
      message: 'Votre nouveau projet a été crée avec succès!',
      projectId: response._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    // Next to reach the error middleware
    next(err);
  }
};

exports.getUserProjects = async (req, res, next) => {
  const { userId } = req;

  try {
    // Retrieving current user data
    const user = await User.findById(userId).populate('projects');

    // Sending the response to the client
    res.status(202).json({
      message: 'User projects founded',
      userProjects: user.projects,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    // Next to reach the error middleware
    next(err);
  }
};
