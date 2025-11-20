const Livre = require('../models/Livre');

// GET tous les livres
const getLivres = async (req, res) => {
  try {
    const { search, genre, disponible } = req.query;
    let query = {};

    // Filtre de recherche
    if (search) {
      query.$text = { $search: search };
    }

    // Filtre par genre
    if (genre) {
      query.genre = new RegExp(genre, 'i');
    }

    // Filtre par disponibilité
    if (disponible !== undefined) {
      query.disponible = disponible === 'true';
    }

    const livres = await Livre.find(query).sort({ titre: 1 });
    
    res.json({
      count: livres.length,
      livres
    });
  } catch (error) {
    console.error('Erreur getLivres:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des livres',
      error: error.message 
    });
  }
};

// GET livre par ID
const getLivreById = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);
    
    if (!livre) {
      return res.status(404).json({ 
        message: 'Livre non trouvé' 
      });
    }

    res.json(livre);
  } catch (error) {
    console.error('Erreur getLivreById:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du livre',
      error: error.message 
    });
  }
};

// POST créer un livre
const createLivre = async (req, res) => {
  try {
    const livre = await Livre.create(req.body);
    
    res.status(201).json({
      message: 'Livre créé avec succès',
      livre
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Un livre avec cet ISBN existe déjà' 
      });
    }
    
    console.error('Erreur createLivre:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du livre',
      error: error.message 
    });
  }
};

// PUT modifier un livre
const updateLivre = async (req, res) => {
  try {
    const livre = await Livre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!livre) {
      return res.status(404).json({ 
        message: 'Livre non trouvé' 
      });
    }

    res.json({
      message: 'Livre modifié avec succès',
      livre
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Un livre avec cet ISBN existe déjà' 
      });
    }
    
    console.error('Erreur updateLivre:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la modification du livre',
      error: error.message 
    });
  }
};

// DELETE supprimer un livre
const deleteLivre = async (req, res) => {
  try {
    const livre = await Livre.findByIdAndDelete(req.params.id);

    if (!livre) {
      return res.status(404).json({ 
        message: 'Livre non trouvé' 
      });
    }

    res.json({ 
      message: 'Livre supprimé avec succès' 
    });
  } catch (error) {
    console.error('Erreur deleteLivre:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du livre',
      error: error.message 
    });
  }
};

// Export XML des livres (version simplifiée sans libxmljs2)
const exportLivresXML = async (req, res) => {
  try {
    const livres = await Livre.find().sort({ titre: 1 });
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<livres>\n';
    
    livres.forEach(livre => {
      xml += '  <livre>\n';
      xml += `    <isbn>${livre.isbn}</isbn>\n`;
      xml += `    <titre>${escapeXML(livre.titre)}</titre>\n`;
      xml += `    <auteur>${escapeXML(livre.auteur)}</auteur>\n`;
      xml += `    <editeur>${escapeXML(livre.editeur)}</editeur>\n`;
      xml += `    <anneePublication>${livre.anneePublication}</anneePublication>\n`;
      xml += `    <genre>${escapeXML(livre.genre)}</genre>\n`;
      xml += `    <disponible>${livre.disponible}</disponible>\n`;
      if (livre.description) {
        xml += `    <description>${escapeXML(livre.description)}</description>\n`;
      }
      xml += '  </livre>\n';
    });
    
    xml += '</livres>';

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Erreur exportLivresXML:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'export XML',
      error: error.message 
    });
  }
};

// Fonction utilitaire pour échapper les caractères XML
function escapeXML(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

module.exports = {
  getLivres,
  getLivreById,
  createLivre,
  updateLivre,
  deleteLivre,
  exportLivresXML
};