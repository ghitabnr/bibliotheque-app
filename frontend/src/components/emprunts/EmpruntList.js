import React, { useState } from 'react';
import './EmpruntList.css';

const EmpruntList = ({ emprunts, loading, onRetour, onRefresh }) => {
  const [filterStatut, setFilterStatut] = useState('');

  const filteredEmprunts = emprunts.filter(emprunt => {
    return !filterStatut || emprunt.statut === filterStatut;
  });

  const getStatutBadgeClass = (statut) => {
    switch (statut) {
      case 'emprunté':
        return 'statut-emprunte';
      case 'retourné':
        return 'statut-retourne';
      case 'en retard':
        return 'statut-retard';
      default:
        return '';
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case 'emprunté':
        return '📖 Emprunté';
      case 'retourné':
        return '✅ Retourné';
      case 'en retard':
        return '⚠️ En retard';
      default:
        return statut;
    }
  };

  const isRetourPossible = (emprunt) => {
    return emprunt.statut === 'emprunté' || emprunt.statut === 'en retard';
  };

  const isEnRetard = (emprunt) => {
    if (emprunt.statut === 'retourné') return false;
    const dateRetour = new Date(emprunt.dateRetourPrevue);
    const aujourdhui = new Date();
    return aujourdhui > dateRetour;
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Chargement des emprunts...</p>
      </div>
    );
  }

  return (
    <div className="emprunt-list">
      {/* Filtres */}
      <div className="filters-card">
        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">Statut</label>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="filter-select"
            >
              <option value="">Tous les statuts</option>
              <option value="emprunté">Empruntés</option>
              <option value="retourné">Retournés</option>
              <option value="en retard">En retard</option>
            </select>
          </div>
          
          <button 
            onClick={() => {
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
        <p>{filteredEmprunts.length} emprunt(s) trouvé(s)</p>
      </div>

      {/* Liste des emprunts */}
      <div className="emprunts-grid">
        {filteredEmprunts.length === 0 ? (
          <div className="no-results">
            <p>Aucun emprunt trouvé</p>
          </div>
        ) : (
          filteredEmprunts.map(emprunt => {
            const retard = isEnRetard(emprunt);
            
            return (
              <div key={emprunt._id} className={`emprunt-card ${retard ? 'emprunt-retard' : ''}`}>
                <div className="emprunt-header">
                  <h3 className="emprunt-livre">{emprunt.livre?.titre}</h3>
                  <span className={`statut-badge ${getStatutBadgeClass(emprunt.statut)}`}>
                    {getStatutText(emprunt.statut)}
                  </span>
                </div>
                
                <div className="emprunt-details">
                  <div className="detail-row">
                    <strong>Livre:</strong> 
                    <span>{emprunt.livre?.titre} - {emprunt.livre?.auteur}</span>
                  </div>
                  
                  <div className="detail-row">
                    <strong>ISBN:</strong> 
                    <span>{emprunt.livre?.isbn}</span>
                  </div>
                  
                  <div className="detail-row">
                    <strong>Membre:</strong> 
                    <span>{emprunt.membre?.prenom} {emprunt.membre?.nom} ({emprunt.membre?.numeroMembre})</span>
                  </div>
                  
                  <div className="detail-row">
                    <strong>Date d'emprunt:</strong> 
                    <span>{new Date(emprunt.dateEmprunt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  
                  <div className="detail-row">
                    <strong>Retour prévu:</strong> 
                    <span className={retard ? 'date-retard' : ''}>
                      {new Date(emprunt.dateRetourPrevue).toLocaleDateString('fr-FR')}
                      {retard && ' ⚠️'}
                    </span>
                  </div>
                  
                  {emprunt.dateRetourEffective && (
                    <div className="detail-row">
                      <strong>Retour effectif:</strong> 
                      <span>{new Date(emprunt.dateRetourEffective).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>
                
                <div className="emprunt-actions">
                  {isRetourPossible(emprunt) && (
                    <button 
                      onClick={() => onRetour(emprunt._id)}
                      className="btn btn-success btn-sm"
                    >
                      📚 Retourner
                    </button>
                  )}
                </div>
                
                {retard && (
                  <div className="retard-alert">
                    ⚠️ Ce livre est en retard de {Math.ceil((new Date() - new Date(emprunt.dateRetourPrevue)) / (1000 * 60 * 60 * 24))} jour(s)
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EmpruntList;