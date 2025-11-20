const mongoose = require('mongoose');

const empruntSchema = new mongoose.Schema({
  membre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membre',
    required: [true, 'Le membre est requis']
  },
  livre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livre',
    required: [true, 'Le livre est requis']
  },
  dateEmprunt: {
    type: Date,
    default: Date.now
  },
  dateRetourPrevue: {
    type: Date,
    required: [true, 'La date de retour prévue est requise']
  },
  dateRetourEffective: {
    type: Date
  },
  statut: {
    type: String,
    enum: ['emprunté', 'retourné', 'en retard'],
    default: 'emprunté'
  }
}, {
  timestamps: true
});

// Middleware pour mettre à jour la disponibilité du livre
empruntSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Marquer le livre comme non disponible
    await mongoose.model('Livre').findByIdAndUpdate(this.livre, { disponible: false });
  }
  
  if (this.isModified('dateRetourEffective') && this.dateRetourEffective) {
    // Marquer le livre comme disponible
    await mongoose.model('Livre').findByIdAndUpdate(this.livre, { disponible: true });
    this.statut = 'retourné';
  }
  
  next();
});

// Vérifier les retards
empruntSchema.methods.verifierRetard = function() {
  if (this.statut === 'emprunté' && new Date() > this.dateRetourPrevue) {
    this.statut = 'en retard';
    return true;
  }
  return false;
};

module.exports = mongoose.model('Emprunt', empruntSchema);