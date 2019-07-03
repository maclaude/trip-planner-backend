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
const projectController = require('../controllers/project');
// Utils
const projectValidation = require('../utils/validation/project-validation');

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
// POST /project/new-project
router.post(
  '/new-project',
  isAuth,
  projectValidation.postNewProject,
  projectController.postNewProject
);

// POST /project/user-role
router.post('/user-role', isAuth, projectController.getProjectUserRole);

// POST /project/new-dates
router.post('/new-dates', isAuth, projectController.postProjectDates);

// DELETE /project/delete-dates
router.delete('/delete-dates', isAuth, projectController.deleteProjectDates);

// PUT /project/vote-dates
router.put('/vote-dates', isAuth, projectController.voteProjectDates);

// POST /project/add-participants
router.post(
  '/add-participants',
  isAuth,
  projectController.sendProjectInvitation
);

// GET /project/invitation/:token
router.get('/invitation/:token', projectController.checkProjectInvitationToken);

// POST /project/new-suggestion
router.post('/new-suggestion', isAuth, projectController.postNewSuggestion);

// GET /project/suggestions/:projectId
router.get(
  '/suggestions/:projectId',
  isAuth,
  projectController.getProjectSuggestions
);

/**
 * Export
 */
module.exports = router;
