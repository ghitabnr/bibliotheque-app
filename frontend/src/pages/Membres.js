import React, { useState, useEffect } from 'react';
import MembreList from '../components/membres/MembreList';
import MembreForm from '../components/membres/MembreForm';
import { membreService } from '../services/api';
import './Membres.css';

const Membres = () => {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMembre, setEditingMembre] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchMembres();
  }, []);

  const fetchMembres = async (params = {}) => {
    try {
      setLoading(true);
      const response = await membreService.getAll(params);
      setMembres(response.membres);
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des membres');
      console.error('Error fetching membres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (membreData) => {
    try {
      await membreService.create(membreData);
      setSuccessMessage('Membre créé avec succès');
      setShowForm(false);
      fetchMembres();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la création du membre');
    }
  };

  const handleUpdate = async (id, membreData) => {
    try {
      await membreService.update(id, membreData);
      setSuccessMessage('Membre modifié avec succès');
      setShowForm(false);
      setEditingMembre(null);
      fetchMembres();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la modification du membre');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      try {
        await membreService.delete(id);
        setSuccessMessage('Membre supprimé avec succès');
        fetchMembres();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors de la suppression du membre');
      }
    }
  };

  const handleEdit = (membre) => {
    setEditingMembre(membre);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMembre(null);
  };

  return (
    <div className="membres-page">
      <div className="page-header">
        <h1 className="page-title">Gestion des Membres</h1>
        <div className="page-actions">
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            ➕ Ajouter un Membre
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
        <MembreForm
          membre={editingMembre}
          onSubmit={editingMembre ? handleUpdate : handleCreate}
          onCancel={handleCancel}
        />
      )}

      <MembreList
        membres={membres}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchMembres}
      />
    </div>
  );
};

export default Membres;