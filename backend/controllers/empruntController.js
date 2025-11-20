const Emprunt = require('../models/Emprunt');
const Livre = require('../models/Livre');
const Membre = require('../models/Membre');

// GET tous les emprunts
const getEmprunts = async (req, res) => {
  try {
    const { statut } = req.query;
    let query = {};

    // Filtre par statut
    if (statut) {
      query.statut = statut;
    }

    const emprunts = await Emprunt.find(query)
      .populate('membre', 'numeroMembre nom prenom email')
      .populate('livre', 'isbn titre auteur')
      .sort({ dateEmprunt: -1 });
    
    res.json({
      count: emprunts.length,
      emprunts
    });
  } catch (error) {
    console.error('Erreur getEmprunts:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des emprunts',
      error: error.message 
    });
  }
};

// GET emprunt par ID
const getEmpruntById = async (req, res) => {
  try {
    const emprunt = await Emprunt.findById(req.params.id)
      .populate('membre')
      .populate('livre');

    if (!emprunt) {
      return res.status(404).json({ 
        message: 'Emprunt non trouvé' 
      });
    }

    res.json(emprunt);
  } catch (error) {
    console.error('Erreur getEmpruntById:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de l\'emprunt',
      error: error.message 
    });
  }
};

// POST créer un emprunt
const createEmprunt = async (req, res) => {
  try {
    const { membre, livre, dateRetourPrevue } = req.body;

    // Vérifier si le livre existe et est disponible
    const livreDoc = await Livre.findById(livre);
    if (!livreDoc) {
      return res.status(404).json({ 
        message: 'Livre non trouvé' 
      });
    }

    if (!livreDoc.disponible) {
      return res.status(400).json({ 
        message: 'Ce livre n\'est pas disponible' 
      });
    }

    // Vérifier si le membre existe
    const membreDoc = await Membre.findById(membre);
    if (!membreDoc) {
      return res.status(404).json({ 
        message: 'Membre non trouvé' 
      });
    }

    // Vérifier si le membre est actif
    if (membreDoc.statut !== 'actif') {
      return res.status(400).json({ 
        message: 'Le membre n\'est pas actif' 
      });
    }

    // Créer l'emprunt
    const emprunt = await Emprunt.create({
      membre,
      livre,
      dateRetourPrevue
    });

    // Populer les données pour la réponse
    await emprunt.populate('membre', 'numeroMembre nom prenom email');
    await emprunt.populate('livre', 'isbn titre auteur');

    res.status(201).json({
      message: 'Emprunt créé avec succès',
      emprunt
    });
  } catch (error) {
    console.error('Erreur createEmprunt:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de l\'emprunt',
      error: error.message 
    });
  }
};

// PUT retourner un livre
const retournerLivre = async (req, res) => {
  try {
    const emprunt = await Emprunt.findById(req.params.id)
      .populate('membre')
      .populate('livre');

    if (!emprunt) {
      return res.status(404).json({ 
        message: 'Emprunt non trouvé' 
      });
    }

    if (emprunt.statut === 'retourné') {
      return res.status(400).json({ 
        message: 'Ce livre a déjà été retourné' 
      });
    }

    // Marquer comme retourné
    emprunt.dateRetourEffective = new Date();
    emprunt.statut = 'retourné';
    await emprunt.save();

    res.json({
      message: 'Livre retourné avec succès',
      emprunt
    });
  } catch (error) {
    console.error('Erreur retournerLivre:', error);
    res.status(500).json({ 
      message: 'Erreur lors du retour du livre',
      error: error.message 
    });
  }
};

// GET emprunts en retard
const getEmpruntsEnRetard = async (req, res) => {
  try {
    const empruntsEnRetard = await Emprunt.find({
      statut: 'emprunté',
      dateRetourPrevue: { $lt: new Date() }
    })
    .populate('membre', 'numeroMembre nom prenom email telephone')
    .populate('livre', 'isbn titre auteur')
    .sort({ dateRetourPrevue: 1 });

    res.json({
      count: empruntsEnRetard.length,
      emprunts: empruntsEnRetard
    });
  } catch (error) {
    console.error('Erreur getEmpruntsEnRetard:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des emprunts en retard',
      error: error.message 
    });
  }
};

module.exports = {
  getEmprunts,
  getEmpruntById,
  createEmprunt,
  retournerLivre,
  getEmpruntsEnRetard
};