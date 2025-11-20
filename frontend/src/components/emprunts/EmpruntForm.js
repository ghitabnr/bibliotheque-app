import React, { useState, useEffect } from 'react';
import { livreService, membreService } from '../../services/api';
import './EmpruntForm.css';

const EmpruntForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    membre: '',
    livre: '',
    dateRetourPrevue: ''
  });
  const [livres, setLivres] = useState([]);
  const [membres, setMembres] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        
        const [livresRes, membresRes] = await Promise.all([
          livreService.getAll({ disponible: true }),
          membreService.getAll({ statut: 'actif' })
        ]);

        setLivres(livresRes.livres);
        setMembres(membresRes.membres);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    
    if (!formData.membre) {
      newErrors.membre = 'Le membre est requis';
    }
    
    if (!formData.livre) {
      newErrors.livre = 'Le livre est requis';
    }
    
    if (!formData.dateRetourPrevue) {
      newErrors.dateRetourPrevue = 'La date de retour prévue est requise';
    } else {
      const selectedDate = new Date(formData.dateRetourPrevue);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.dateRetourPrevue = 'La date de retour doit être dans le futur';
      }
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
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcul de la date de retour par défaut (15 jours)
  const getDefaultReturnDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return date.toISOString().split('T')[0];
  };

  if (loadingData) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading">
            <p>Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Nouvel Emprunt</h2>
          <button onClick={onCancel} className="close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="emprunt-form">
          <div className="form-group">
            <label className="form-label">Membre *</label>
            <select
              name="membre"
              value={formData.membre}
              onChange={handleChange}
              className={`form-input ${errors.membre ? 'error' : ''}`}
            >
              <option value="">Sélectionner un membre</option>
              {membres.map(membre => (
                <option key={membre._id} value={membre._id}>
                  {membre.prenom} {membre.nom} - {membre.numeroMembre}
                </option>
              ))}
            </select>
            {errors.membre && <span className="error-text">{errors.membre}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Livre *</label>
            <select
              name="livre"
              value={formData.livre}
              onChange={handleChange}
              className={`form-input ${errors.livre ? 'error' : ''}`}
            >
              <option value="">Sélectionner un livre</option>
              {livres.map(livre => (
                <option key={livre._id} value={livre._id}>
                  {livre.titre} - {livre.auteur} ({livre.isbn})
                </option>
              ))}
            </select>
            {errors.livre && <span className="error-text">{errors.livre}</span>}
            
            {livres.length === 0 && (
              <div className="info-message">
                ⚠️ Aucun livre disponible pour l'emprunt
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Date de retour prévue *</label>
            <input
              type="date"
              name="dateRetourPrevue"
              value={formData.dateRetourPrevue}
              onChange={handleChange}
              className={`form-input ${errors.dateRetourPrevue ? 'error' : ''}`}
              min={new Date().toISOString().split('T')[0]}
              defaultValue={getDefaultReturnDate()}
            />
            {errors.dateRetourPrevue && <span className="error-text">{errors.dateRetourPrevue}</span>}
            <div className="help-text">
              Durée recommandée: 15 jours
            </div>
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
              disabled={loading || livres.length === 0}
            >
              {loading ? 'Création...' : 'Créer l\'emprunt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpruntForm;