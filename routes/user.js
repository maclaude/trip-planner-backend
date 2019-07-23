/**
 * NPM import
 */
const express = require('express');

/**
 * Local import
 */
// Checking authentication middleware
const isAuth = require('../middlewares/is-auth');
// Controllers
const userController = require('../controllers/user');

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
// GET /user/projects
router.get('/projects', isAuth, userController.getUserProjects);

// GET /user/informations
router.get('/informations', isAuth, userController.getUserInformations);

// POST /user/invitation
router.post('/invitation', isAuth, userController.addUserProjectInvitation);

// GET /user/invitations
router.get('/invitations', isAuth, userController.getUserProjectsInvitations);

// POST /user/invitation-response
router.post(
  '/invitation-response',
  isAuth,
  userController.postUserProjectInvitationResponse
);

/**
 * Export
 */
module.exports = router;
