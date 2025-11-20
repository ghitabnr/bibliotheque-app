const express = require('express');
const {
  getEmprunts,
  getEmpruntById,
  createEmprunt,
  retournerLivre,
  getEmpruntsEnRetard
} = require('../controllers/empruntController');
const auth = require('../middleware/auth');
const { validateObjectId, validateEmprunt } = require('../middleware/validation');

const router = express.Router();

// Toutes les routes sont protégées par authentification
router.use(auth);

// @route   GET /api/emprunts
// @desc    Récupérer tous les emprunts
// @access  Private
router.get('/', getEmprunts);

// @route   GET /api/emprunts/retard
// @desc    Récupérer les emprunts en retard
// @access  Private
router.get('/retard', getEmpruntsEnRetard);

// @route   GET /api/emprunts/:id
// @desc    Récupérer un emprunt par son ID
// @access  Private
router.get('/:id', validateObjectId, getEmpruntById);

// @route   POST /api/emprunts
// @desc    Créer un nouvel emprunt
// @access  Private
router.post('/', validateEmprunt, createEmprunt);

// @route   PUT /api/emprunts/:id/retour
// @desc    Retourner un livre
// @access  Private
router.put('/:id/retour', validateObjectId, retournerLivre);

module.exports = router;