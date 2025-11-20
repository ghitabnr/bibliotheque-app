const mongoose = require('mongoose');

const membreSchema = new mongoose.Schema({
  numeroMembre: {
    type: String,
    unique: true,
    default: function() {
      // Générer un numéro temporaire, sera remplacé par le middleware
      return `TEMP${Date.now()}`;
    }
  },
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  prenom: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true
  },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est requis'],
    trim: true
  },
  adresse: {
    rue: String,
    ville: String,
    codePostal: String
  },
  dateInscription: {
    type: Date,
    default: Date.now
  },
  statut: {
    type: String,
    enum: ['actif', 'suspendu', 'inactif'],
    default: 'actif'
  }
}, {
  timestamps: true
});

// Génération automatique du numéro de membre
membreSchema.pre('save', async function(next) {
  if (this.isNew && this.numeroMembre.startsWith('TEMP')) {
    const count = await mongoose.model('Membre').countDocuments();
    this.numeroMembre = `MEM${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Membre', membreSchema);