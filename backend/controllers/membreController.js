const Membre = require('../models/Membre');

// GET tous les membres
const getMembres = async (req, res) => {
  try {
    const { search, statut } = req.query;
    let query = {};

    // Filtre de recherche
    if (search) {
      query.$or = [
        { nom: new RegExp(search, 'i') },
        { prenom: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { numeroMembre: new RegExp(search, 'i') }
      ];
    }

    // Filtre par statut
    if (statut) {
      query.statut = statut;
    }

    const membres = await Membre.find(query).sort({ nom: 1, prenom: 1 });
    
    res.json({
      count: membres.length,
      membres
    });
  } catch (error) {
    console.error('Erreur getMembres:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des membres',
      error: error.message 
    });
  }
};

// GET membre par ID
const getMembreById = async (req, res) => {
  try {
    const membre = await Membre.findById(req.params.id);
    
    if (!membre) {
      return res.status(404).json({ 
        message: 'Membre non trouvé' 
      });
    }

    res.json(membre);
  } catch (error) {
    console.error('Erreur getMembreById:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du membre',
      error: error.message 
    });
  }
};

// POST créer un membre
const createMembre = async (req, res) => {
  try {
    const membre = await Membre.create(req.body);
    
    res.status(201).json({
      message: 'Membre créé avec succès',
      membre
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Un membre avec cet email existe déjà' 
      });
    }
    
    console.error('Erreur createMembre:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du membre',
      error: error.message 
    });
  }
};

// PUT modifier un membre
const updateMembre = async (req, res) => {
  try {
    const membre = await Membre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!membre) {
      return res.status(404).json({ 
        message: 'Membre non trouvé' 
      });
    }

    res.json({
      message: 'Membre modifié avec succès',
      membre
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Un membre avec cet email existe déjà' 
      });
    }
    
    console.error('Erreur updateMembre:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la modification du membre',
      error: error.message 
    });
  }
};

// DELETE supprimer un membre
const deleteMembre = async (req, res) => {
  try {
    const membre = await Membre.findByIdAndDelete(req.params.id);

    if (!membre) {
      return res.status(404).json({ 
        message: 'Membre non trouvé' 
      });
    }

    res.json({ 
      message: 'Membre supprimé avec succès' 
    });
  } catch (error) {
    console.error('Erreur deleteMembre:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du membre',
      error: error.message 
    });
  }
};

module.exports = {
  getMembres,
  getMembreById,
  createMembre,
  updateMembre,
  deleteMembre
};