const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getProfileById } = require('../controllers/profileController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Get current user's profile
router.get('/', authenticateUser, getProfile);

// Get any user's profile by ID (for doctors viewing patients)
router.get('/:id', authenticateUser, getProfileById);

// Update profile
router.put('/', authenticateUser, updateProfile);

module.exports = router;
