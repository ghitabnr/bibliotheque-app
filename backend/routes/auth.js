const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Inscription d'un nouvel utilisateur
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Connexion d'un utilisateur
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Récupérer le profil de l'utilisateur connecté
// @access  Private
router.get('/me', auth, getMe);

module.exports = router;