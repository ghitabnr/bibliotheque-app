import React, { useState, useEffect } from 'react';
import './LivreForm.css';

const LivreForm = ({ livre, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    isbn: '',
    titre: '',
    auteur: '',
    editeur: '',
    anneePublication: '',
    genre: '',
    description: '',
    disponible: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (livre) {
      setFormData({
        isbn: livre.isbn || '',
        titre: livre.titre || '',
        auteur: livre.auteur || '',
        editeur: livre.editeur || '',
        anneePublication: livre.anneePublication || '',
        genre: livre.genre || '',
        description: livre.description || '',
        disponible: livre.disponible !== undefined ? livre.disponible : true
      });
    }
  }, [livre]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.isbn.trim()) {
      newErrors.isbn = 'L\'ISBN est requis';
    }
    
    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    }
    
    if (!formData.auteur.trim()) {
      newErrors.auteur = 'L\'auteur est requis';
    }
    
    if (!formData.editeur.trim()) {
      newErrors.editeur = 'L\'éditeur est requis';
    }
    
    if (!formData.anneePublication) {
      newErrors.anneePublication = 'L\'année de publication est requise';
    } else if (formData.anneePublication < 1000 || formData.anneePublication > new Date().getFullYear()) {
      newErrors.anneePublication = 'Année invalide';
    }
    
    if (!formData.genre.trim()) {
      newErrors.genre = 'Le genre est requis';
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
      if (livre) {
        await onSubmit(livre._id, formData);
      } else {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const genres = [
    'Roman', 'Science-Fiction', 'Fantasy', 'Policier', 'Historique',
    'Biographie', 'Poésie', 'Théâtre', 'Jeunesse', 'BD-Manga',
    'Développement personnel', 'Cuisine', 'Voyage', 'Art', 'Science'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{livre ? 'Modifier le Livre' : 'Ajouter un Livre'}</h2>
          <button onClick={onCancel} className="close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="livre-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ISBN *</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className={`form-input ${errors.isbn ? 'error' : ''}`}
                placeholder="978-2-07-036822-8"
              />
              {errors.isbn && <span className="error-text">{errors.isbn}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Titre *</label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                className={`form-input ${errors.titre ? 'error' : ''}`}
                placeholder="Titre du livre"
              />
              {errors.titre && <span className="error-text">{errors.titre}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Auteur *</label>
              <input
                type="text"
                name="auteur"
                value={formData.auteur}
                onChange={handleChange}
                className={`form-input ${errors.auteur ? 'error' : ''}`}
                placeholder="Nom de l'auteur"
              />
              {errors.auteur && <span className="error-text">{errors.auteur}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Éditeur *</label>
              <input
                type="text"
                name="editeur"
                value={formData.editeur}
                onChange={handleChange}
                className={`form-input ${errors.editeur ? 'error' : ''}`}
                placeholder="Maison d'édition"
              />
              {errors.editeur && <span className="error-text">{errors.editeur}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Année de Publication *</label>
              <input
                type="number"
                name="anneePublication"
                value={formData.anneePublication}
                onChange={handleChange}
                className={`form-input ${errors.anneePublication ? 'error' : ''}`}
                placeholder="2024"
                min="1000"
                max={new Date().getFullYear()}
              />
              {errors.anneePublication && <span className="error-text">{errors.anneePublication}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Genre *</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className={`form-input ${errors.genre ? 'error' : ''}`}
              >
                <option value="">Sélectionner un genre</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              {errors.genre && <span className="error-text">{errors.genre}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input form-textarea"
              placeholder="Description du livre..."
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="disponible"
                checked={formData.disponible}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Livre disponible
            </label>
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
              {loading ? 'Enregistrement...' : (livre ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LivreForm;