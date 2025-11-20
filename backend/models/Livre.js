const mongoose = require('mongoose');

const livreSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: [true, 'L\'ISBN est requis'],
    unique: true,
    trim: true
  },
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  auteur: {
    type: String,
    required: [true, 'L\'auteur est requis'],
    trim: true
  },
  editeur: {
    type: String,
    required: [true, 'L\'éditeur est requis'],
    trim: true
  },
  anneePublication: {
    type: Number,
    required: [true, 'L\'année de publication est requise'],
    min: [1000, 'Année invalide'],
    max: [new Date().getFullYear(), 'Année dans le futur']
  },
  genre: {
    type: String,
    required: [true, 'Le genre est requis'],
    trim: true
  },
  disponible: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index pour la recherche
livreSchema.index({ titre: 'text', auteur: 'text', genre: 'text' });

module.exports = mongoose.model('Livre', livreSchema);