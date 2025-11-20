const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bibliotheque')
  .then(() => console.log(' Connecté à MongoDB'))
  .catch(err => console.error(' Erreur connexion MongoDB:', err));

// Routes de base
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Bibliothèque - Backend opérationnel',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      livres: '/api/livres',
      membres: '/api/membres',
      emprunts: '/api/emprunts'
    }
  });
});

// Routes API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/livres', require('./routes/livres'));
app.use('/api/membres', require('./routes/membres'));
app.use('/api/emprunts', require('./routes/emprunts'));

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur interne' });
});

// Route 404 - CORRIGÉE
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route non trouvée',
    path: req.path,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Serveur démarré sur le port ${PORT}`);
  console.log(` API Bibliothèque accessible sur: http://localhost:${PORT}`);
});