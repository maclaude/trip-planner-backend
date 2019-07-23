// User controller

/**
 * Local import
 */
// Models
const User = require('../models/user');
const Project = require('../models/project');

/**
 * Code
 */
exports.getUserProjects = async (req, res, next) => {
  const { userId } = req;

  try {
    // Finding current user data
    const user = await User.findById(userId)
      .populate({
        path: 'projects',
        populate: {
          path: 'participants dates',
          select: 'firstname lastname avatar start_date end_date user_vote',
        },
      })
      .lean();

    // Throw an error if nothing is retrieved
    if (!user) {
      const error = new Error('No user founded');
      error.statusCode = 401;
      throw error;
    }

    // Sending client response
    if (user.projects.length === 0) {
      res.status(204).json({
        message: 'No user projects founded',
      });
    } else {
      res.status(200).json({
        message: 'User projects founded',
        userProjects: user.projects,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserInformations = async (req, res, next) => {
  const { userId } = req;

  try {
    // Finding current user
    const user = await User.findById(userId);

    // Throw an error if nothing is retrieved
    if (!user) {
      const error = new Error('No user found with the given _id');
      error.statusCode = 401;
      throw error;
    }

    // Response object
    const response = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      avatar: user.avatar || 'default.png',
    };

    // Sending client response
    res.status(200).json({
      message: 'User information founded',
      user: response,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addUserProjectInvitation = async (req, res, next) => {
  const { projectId } = req.body;
  const { userId } = req;

  try {
    // Finding current user
    const currentUser = await User.findById(userId);
    // Adding projectId to user's invitations
    currentUser.invitations.push(projectId);
    // Saving updates
    await currentUser.save();

    // Sending client response
    res
      .status(202)
      .json({ message: "Project added to the user's invitations" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserProjectsInvitations = async (req, res, next) => {
  const { userId } = req;

  try {
    // Finding current user invitations data
    const user = await User.findById(userId).populate({
      path: 'invitations',
      select: '_id title',
      populate: {
        path: 'creator',
        select: 'firstname',
      },
    });

    // Throw an error if nothing is retrieved
    if (!user) {
      const error = new Error('No user found with the given _id');
      error.statusCode = 401;
      throw error;
    }

    // Sending client response
    if (user.invitations.length === 0) {
      res.status(204).json({
        message: 'No user invitations founded',
      });
    } else {
      res.status(200).json({
        message: 'User invitations founded',
        userInvitations: user.invitations,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postUserProjectInvitationResponse = async (req, res, next) => {
  const { userId } = req;
  const { response, projectId } = req.body;

  try {
    // Finding current user data
    const user = await User.findById(userId);

    // Throw an error if nothing is retrieved
    if (!user) {
      const error = new Error('No user found');
      error.statusCode = 401;
      throw error;
    }

    // Retrieving current project
    const project = await Project.findById(projectId);

    // Throw an error if nothing is retrieved
    if (!project) {
      const error = new Error('No project found');
      error.statusCode = 401;
      throw error;
    }

    // Accept or decline invitation
    if (response === 'accepted') {
      await user.projects.push(projectId);
      await user.invitations.pull(projectId);
      await project.participants.push(userId);
    } else if (response === 'declined') {
      await user.invitations.pull(projectId);
    }

    // Saving updates
    await user.save();
    await project.save();

    // Sending client response
    res.status(202).json({ message: 'User answer response sent' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
