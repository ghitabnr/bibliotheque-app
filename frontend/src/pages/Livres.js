import React, { useState, useEffect } from 'react';
import LivreList from '../components/livres/LivreList';
import LivreForm from '../components/livres/LivreForm';
import { livreService } from '../services/api';
import './Livres.css';

const Livres = () => {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLivre, setEditingLivre] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchLivres();
  }, []);

  const fetchLivres = async (params = {}) => {
    try {
      setLoading(true);
      const response = await livreService.getAll(params);
      setLivres(response.livres);
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des livres');
      console.error('Error fetching livres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (livreData) => {
    try {
      await livreService.create(livreData);
      setSuccessMessage('Livre créé avec succès');
      setShowForm(false);
      fetchLivres();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la création du livre');
    }
  };

  const handleUpdate = async (id, livreData) => {
    try {
      await livreService.update(id, livreData);
      setSuccessMessage('Livre modifié avec succès');
      setShowForm(false);
      setEditingLivre(null);
      fetchLivres();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la modification du livre');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      try {
        await livreService.delete(id);
        setSuccessMessage('Livre supprimé avec succès');
        fetchLivres();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors de la suppression du livre');
      }
    }
  };

  const handleEdit = (livre) => {
    setEditingLivre(livre);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLivre(null);
  };

  const handleExportXML = async () => {
    try {
      const xmlData = await livreService.exportXML();
      
      // Créer et télécharger le fichier XML
      const blob = new Blob([xmlData], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'livres-export.xml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccessMessage('Export XML réussi');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Erreur lors de l\'export XML');
    }
  };

  return (
    <div className="livres-page">
      <div className="page-header">
        <h1 className="page-title">Gestion des Livres</h1>
        <div className="page-actions">
          <button 
            onClick={handleExportXML}
            className="btn btn-success"
          >
            📥 Export XML
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            ➕ Ajouter un Livre
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {showForm && (
        <LivreForm
          livre={editingLivre}
          onSubmit={editingLivre ? handleUpdate : handleCreate}
          onCancel={handleCancel}
        />
      )}

      <LivreList
        livres={livres}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchLivres}
      />
    </div>
  );
};

export default Livres;