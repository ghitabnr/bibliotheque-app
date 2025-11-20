const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ 
      message: 'ID invalide' 
    });
  }
  
  next();
};

const validateEmprunt = (req, res, next) => {
  const { membre, livre, dateRetourPrevue } = req.body;
  
  if (!membre || !livre || !dateRetourPrevue) {
    return res.status(400).json({ 
      message: 'Tous les champs sont requis: membre, livre, dateRetourPrevue' 
    });
  }
  
  // Vérifier que la date de retour est dans le futur
  if (new Date(dateRetourPrevue) <= new Date()) {
    return res.status(400).json({ 
      message: 'La date de retour prévue doit être dans le futur' 
    });
  }
  
  next();
};

module.exports = {
  validateObjectId,
  validateEmprunt
};