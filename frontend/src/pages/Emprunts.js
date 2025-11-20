import React, { useState, useEffect } from 'react';
import EmpruntList from '../components/emprunts/EmpruntList';
import EmpruntForm from '../components/emprunts/EmpruntForm';
import { empruntService } from '../services/api';
import './Emprunts.css';

const Emprunts = () => {
  const [emprunts, setEmprunts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEmprunts();
  }, []);

  const fetchEmprunts = async (params = {}) => {
    try {
      setLoading(true);
      const response = await empruntService.getAll(params);
      setEmprunts(response.emprunts);
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des emprunts');
      console.error('Error fetching emprunts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (empruntData) => {
    try {
      await empruntService.create(empruntData);
      setSuccessMessage('Emprunt créé avec succès');
      setShowForm(false);
      fetchEmprunts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la création de l\'emprunt');
    }
  };

  const handleRetour = async (id) => {
    try {
      await empruntService.retourner(id);
      setSuccessMessage('Livre retourné avec succès');
      fetchEmprunts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors du retour du livre');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const fetchEmpruntsEnRetard = async () => {
    try {
      const response = await empruntService.getEnRetard();
      setEmprunts(response.emprunts);
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des emprunts en retard');
    }
  };

  return (
    <div className="emprunts-page">
      <div className="page-header">
        <h1 className="page-title">Gestion des Emprunts</h1>
        <div className="page-actions">
          <button 
            onClick={fetchEmpruntsEnRetard}
            className="btn btn-warning"
          >
            ⚠️ Voir les Retards
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            ➕ Nouvel Emprunt
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
        <EmpruntForm
          onSubmit={handleCreate}
          onCancel={handleCancel}
        />
      )}

      <EmpruntList
        emprunts={emprunts}
        loading={loading}
        onRetour={handleRetour}
        onRefresh={fetchEmprunts}
      />
    </div>
  );
};

export default Emprunts;