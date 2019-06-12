/**
 * NPM import
 */
const express = require('express');

/**
 * Local import
 */
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
  '/project/new-project',
  projectValidation.postProject,
  projectController.postProject
);

/**
 * Export
 */
module.exports = router;
