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
const Dates = require('../models/dates');

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

    // Response object
    const data = {
      id: response._id.toString(),
      title: response.title,
      description: response.description,
    };

    // Sending the response to the client
    res.status(201).json({
      message: 'Votre nouveau projet a été crée avec succès!',
      data,
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
    const user = await User.findById(userId).populate({
      path: 'projects',
      populate: {
        path: 'dates',
      },
    });

    // Sending the response to the client
    res.status(202).json({
      message: 'User projects founded',
      userProjects: user.projects,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postProjectDates = async (req, res, next) => {
  const { startDate, endDate, projectId } = req.body;

  try {
    // Creating the new dates
    const newDates = await new Dates({
      start_date: startDate,
      end_date: endDate,
      project: projectId,
    });
    // Saving new dates entry
    await newDates.save();

    // Fetching current project
    const project = await Project.findById(projectId);
    // Adding the newDates objectId to the project's dates
    project.dates.push(newDates);
    // Saving the updated project
    await project.save();

    // Sending the response to the client
    res.status(201).json({
      message: 'Dates ajoutées avec succès',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteProjectDates = async (req, res, next) => {
  const { projectId, datesId } = req.body;

  try {
    // Fetching current dates
    const dates = await Dates.findById(datesId);
    // Throw an error if nothing is retrieved
    if (!dates) {
      const error = new Error('Could not find the requested dates.');
      error.statusCode = 404;
      throw error;
    }

    // Fetching current project
    const project = await Project.findById(projectId);
    // Throw an error if nothing is retrieved
    if (!project) {
      const error = new Error('Could not find the requested project.');
      error.statusCode = 404;
      throw error;
    }

    // Deleting dates from database
    await Dates.findByIdAndDelete(datesId);
    // Deleting dates from project's suggested dates
    project.dates.pull(datesId);
    await project.save();

    // Sending the response to the client
    res.status(200).json({ message: 'Dates deleted' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
