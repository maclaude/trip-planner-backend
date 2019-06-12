/**
 * NPM import
 */
const express = require('express');

/**
 * Local import
 */
// Controllers
const projectController = require('../controllers/project');

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
// POST /project/new-project
router.post('/project/new-project', projectController.postProject);

/**
 * Export
 */
module.exports = router;
