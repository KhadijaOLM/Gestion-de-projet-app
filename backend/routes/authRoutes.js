
//backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { authUser, registerUser } = require('../controllers/userController');

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', authUser);

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

module.exports = router;
