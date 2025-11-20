import React, { useState, useEffect } from 'react';
import './MembreForm.css';

const MembreForm = ({ membre, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: {
      rue: '',
      ville: '',
      codePostal: ''
    },
    statut: 'actif'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (membre) {
      setFormData({
        nom: membre.nom || '',
        prenom: membre.prenom || '',
        email: membre.email || '',
        telephone: membre.telephone || '',
        adresse: {
          rue: membre.adresse?.rue || '',
          ville: membre.adresse?.ville || '',
          codePostal: membre.adresse?.codePostal || ''
        },
        statut: membre.statut || 'actif'
      });
    }
  }, [membre]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('adresse.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        adresse: {
          ...prev.adresse,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (membre) {
        await onSubmit(membre._id, formData);
      } else {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{membre ? 'Modifier le Membre' : 'Ajouter un Membre'}</h2>
          <button onClick={onCancel} className="close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="membre-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nom *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={`form-input ${errors.nom ? 'error' : ''}`}
                placeholder="Nom du membre"
              />
              {errors.nom && <span className="error-text">{errors.nom}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Prénom *</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className={`form-input ${errors.prenom ? 'error' : ''}`}
                placeholder="Prénom du membre"
              />
              {errors.prenom && <span className="error-text">{errors.prenom}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="email@exemple.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Téléphone *</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className={`form-input ${errors.telephone ? 'error' : ''}`}
                placeholder="01 23 45 67 89"
              />
              {errors.telephone && <span className="error-text">{errors.telephone}</span>}
            </div>
          </div>

          {/* Adresse */}
          <div className="form-section">
            <h3 className="form-section-title">Adresse (Optionnelle)</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Rue</label>
                <input
                  type="text"
                  name="adresse.rue"
                  value={formData.adresse.rue}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Numéro et nom de rue"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ville</label>
                <input
                  type="text"
                  name="adresse.ville"
                  value={formData.adresse.ville}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ville"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Code Postal</label>
                <input
                  type="text"
                  name="adresse.codePostal"
                  value={formData.adresse.codePostal}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="75000"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Statut</label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="form-input"
            >
              <option value="actif">Actif</option>
              <option value="suspendu">Suspendu</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={onCancel}
              className="btn btn-outline"
              disabled={loading}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : (membre ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembreForm;