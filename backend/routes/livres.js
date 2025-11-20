const express = require('express');
const {
  getLivres,
  getLivreById,
  createLivre,
  updateLivre,
  deleteLivre,
  exportLivresXML
} = require('../controllers/livreController');
const auth = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

// Toutes les routes sont protégées par authentification
router.use(auth);

// @route   GET /api/livres
// @desc    Récupérer tous les livres
// @access  Private
router.get('/', getLivres);

// @route   GET /api/livres/export/xml
// @desc    Exporter les livres en XML
// @access  Private
router.get('/export/xml', exportLivresXML);

// @route   GET /api/livres/:id
// @desc    Récupérer un livre par son ID
// @access  Private
router.get('/:id', validateObjectId, getLivreById);

// @route   POST /api/livres
// @desc    Créer un nouveau livre
// @access  Private
router.post('/', createLivre);

// @route   PUT /api/livres/:id
// @desc    Modifier un livre
// @access  Private
router.put('/:id', validateObjectId, updateLivre);

// @route   DELETE /api/livres/:id
// @desc    Supprimer un livre
// @access  Private
router.delete('/:id', validateObjectId, deleteLivre);

module.exports = router;