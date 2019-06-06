/**
 * NPM import
 */
const express = require('express');

/**
 * Local import
 */
// Controllers
const authController = require('../controllers/auth');

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
// POST /auth/signup
router.post('/signup', authController.signup);
// POST /auth/login
router.post('/login', authController.login);

/**
 * Export
 */
module.exports = router;
