import React, { useState } from 'react';
import './MembreList.css';

const MembreList = ({ membres, loading, onEdit, onDelete, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  const filteredMembres = membres.filter(membre => {
    const matchesSearch = membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         membre.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         membre.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         membre.numeroMembre.includes(searchTerm);
    
    const matchesStatut = !filterStatut || membre.statut === filterStatut;
    
    return matchesSearch && matchesStatut;
  });

  const getStatutBadgeClass = (statut) => {
    switch (statut) {
      case 'actif':
        return 'statut-actif';
      case 'suspendu':
        return 'statut-suspendu';
      case 'inactif':
        return 'statut-inactif';
      default:
        return '';
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case 'actif':
        return '✅ Actif';
      case 'suspendu':
        return '⏸️ Suspendu';
      case 'inactif':
        return '❌ Inactif';
      default:
        return statut;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Chargement des membres...</p>
      </div>
    );
  }

  return (
    <div className="membre-list">
      {/* Filtres et recherche */}
      <div className="filters-card">
        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">Recherche</label>
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, email ou numéro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Statut</label>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="filter-select"
            >
              <option value="">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="suspendu">Suspendu</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
          
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterStatut('');
              onRefresh();
            }}
            className="btn btn-outline"
          >
            🔄 Actualiser
          </button>
        </div>
      </div>

      {/* Résultats */}
      <div className="results-info">
        <p>{filteredMembres.length} membre(s) trouvé(s)</p>
      </div>

      {/* Liste des membres */}
      <div className="membres-table-container">
        {filteredMembres.length === 0 ? (
          <div className="no-results">
            <p>Aucun membre trouvé</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Date d'inscription</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembres.map(membre => (
                <tr key={membre._id}>
                  <td>
                    <strong>{membre.numeroMembre}</strong>
                  </td>
                  <td>{membre.nom}</td>
                  <td>{membre.prenom}</td>
                  <td>{membre.email}</td>
                  <td>{membre.telephone}</td>
                  <td>
                    {new Date(membre.dateInscription).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    <span className={`statut-badge ${getStatutBadgeClass(membre.statut)}`}>
                      {getStatutText(membre.statut)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => onEdit(membre)}
                        className="btn btn-outline btn-sm"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => onDelete(membre._id)}
                        className="btn btn-danger btn-sm"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MembreList;