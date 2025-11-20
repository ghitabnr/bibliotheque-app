const express = require('express');
const {
  getMembres,
  getMembreById,
  createMembre,
  updateMembre,
  deleteMembre
} = require('../controllers/membreController');
const auth = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

// Toutes les routes sont protégées par authentification
router.use(auth);

// @route   GET /api/membres
// @desc    Récupérer tous les membres
// @access  Private
router.get('/', getMembres);

// @route   GET /api/membres/:id
// @desc    Récupérer un membre par son ID
// @access  Private
router.get('/:id', validateObjectId, getMembreById);

// @route   POST /api/membres
// @desc    Créer un nouveau membre
// @access  Private
router.post('/', createMembre);

// @route   PUT /api/membres/:id
// @desc    Modifier un membre
// @access  Private
router.put('/:id', validateObjectId, updateMembre);

// @route   DELETE /api/membres/:id
// @desc    Supprimer un membre
// @access  Private
router.delete('/:id', validateObjectId, deleteMembre);

module.exports = router;