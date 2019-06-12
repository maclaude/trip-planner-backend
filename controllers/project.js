// Project controller

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
    res
      .status(201)
      .json({ message: 'Project created', projectId: response._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    // Next to reach the error middleware
    next(err);
  }
};
