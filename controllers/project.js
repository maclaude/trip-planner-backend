// Project controller

/**
 * NPM import
 */
const { validationResult } = require('express-validator/check');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const jwt = require('jsonwebtoken');

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
// Environment variables
dotenv.config();

// Intialize transporter
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

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
    // Create new project
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

    // Finding creator user
    const user = await User.findById(userId);
    // Adding newProject objectId to user's projects
    user.projects.push(newProject);
    // Saving updates
    await user.save();

    // Response object
    const data = {
      id: response._id.toString(),
      title: response.title,
      description: response.description,
    };

    // Sending client response
    res.status(201).json({
      message: 'Project created',
      data,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    // Redirecting to error middleware
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
        path: 'dates participants',
      },
    });

    // Throw an error if nothing is retrieved
    if (!user) {
      const error = new Error('No user founded');
      error.statusCode = 401;
      throw error;
    }

    if (!user.projects) {
      console.log('User has no projects');
    }

    // Sending client response
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
    // Creating new project dates
    const newDates = await new Dates({
      start_date: startDate,
      end_date: endDate,
      project: projectId,
    });
    await newDates.save();

    // Findin current project
    const project = await Project.findById(projectId);
    // Adding newDates objectId to the project's dates
    project.dates.push(newDates);
    // Saving updates
    await project.save();

    // Sending client response
    res.status(201).json({ message: 'Project dates added' });
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
    // Finding current project dates
    const dates = await Dates.findById(datesId);
    // Throw an error if nothing is retrieved
    if (!dates) {
      const error = new Error('Could not find the requested dates.');
      error.statusCode = 404;
      throw error;
    }

    // Finding current project
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

    // Sending client response
    res.status(200).json({ message: 'Project dates deleted' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.voteProjectDates = async (req, res, next) => {
  const { datesId } = req.body;
  const currentUserId = req.userId;

  try {
    // Find current project dates
    const currentDates = await Dates.findById(datesId);
    // Throw an error if nothing is retrieved
    if (!currentDates) {
      const error = new Error('Could not find the requested dates.');
      error.statusCode = 404;
      throw error;
    }

    // Finding if current user has already vote on current project dates
    const currentUserVoteOnCurrentDates = await Dates.findOne({
      _id: datesId,
      user_vote: { $eq: currentUserId },
    });

    if (!currentUserVoteOnCurrentDates) {
      // Pushing current user's vote
      currentDates.user_vote.push(currentUserId);
    } else if (currentUserVoteOnCurrentDates) {
      // Pulling current user's vote
      currentDates.user_vote.pull(currentUserId);
    }

    // Saving updates
    await currentDates.save();

    // Sending client response
    res.status(202).json({ message: 'Current user vote accepted' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sendProjectInvitation = async (req, res, next) => {
  const {
    currentUsername,
    projectId,
    projectTitle,
    invitedUsername,
    invitedUserEmail,
  } = req.body;

  try {
    // Generating invitation token
    const token = await jwt.sign(
      {
        projectId,
        email: invitedUserEmail,
      },
      'secret',
      { expiresIn: '6h' }
    );

    // Sending invitation email to invited user
    await transporter.sendMail({
      to: invitedUserEmail,
      from: 'invitation@trip-planner.com',
      subject: 'Invitation à rejoindre un projet',
      html: `
        <h3>Bonjour ${invitedUsername} &#128075;</h3>
        <div>
          <p>Tu as été invité par ${currentUsername} à rejoindre son nouveau projet ${projectTitle} &#127881;</p>
          <p>En acceptant l'invitation tu pourras participer à l'organisation de ce voyage
          grâce à toutes les fonctionnalités que propose notre platforme Trip-planner</p>
          <p>Cliques sur le <a href="http://localhost:8000/project/invitation/${token}">lien suivant</a> pour commencer l'aventure &#128640;<p>
        </div>
      `,
    });

    // Sending client response
    res.status(202).json({ message: 'Invitation sent' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.checkInvitationToken = async (req, res, next) => {
  const { token } = req.params;

  try {
    // Checking token validity
    const decodedToken = await jwt.verify(token, 'secret');

    // If token isn't valid, throw an error
    if (!decodedToken) {
      const error = new Error('Invalid invitation token');
      error.statusCode = 401;
      throw error;
    }

    // Getting projectId from token payload
    const { projectId } = decodedToken;

    // Redirecting the client
    res.redirect(`http://localhost:8080/invitation/${projectId}`);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addUserInvitation = async (req, res, next) => {
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

exports.getUserInvitations = async (req, res, next) => {
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
      const error = new Error('No user found with this email');
      error.statusCode = 401;
      throw error;
    }

    // Sending client response
    res.status(202).json({
      message: 'User invitations founded',
      userInvitations: user.invitations,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postInvitationResponse = async (req, res, next) => {
  const { userId } = req;
  const { response, projectId } = req.body;

  try {
    // Retrieving current user data
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

    if (response === 'accepted') {
      await user.projects.push(projectId);
      await user.invitations.pull(projectId);
      await project.participants.push(userId);
    }

    if (response === 'declined') {
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
