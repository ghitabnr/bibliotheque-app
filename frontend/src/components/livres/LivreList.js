import React, { useState } from 'react';
import './LivreList.css';

const LivreList = ({ livres, loading, onEdit, onDelete, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterDisponible, setFilterDisponible] = useState('');

  const filteredLivres = livres.filter(livre => {
    const matchesSearch = livre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         livre.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         livre.isbn.includes(searchTerm);
    
    const matchesGenre = !filterGenre || livre.genre === filterGenre;
    const matchesDisponible = filterDisponible === '' || 
                             (filterDisponible === 'true' && livre.disponible) ||
                             (filterDisponible === 'false' && !livre.disponible);
    
    return matchesSearch && matchesGenre && matchesDisponible;
  });

  const genres = [...new Set(livres.map(livre => livre.genre))];

  if (loading) {
    return (
      <div className="loading">
        <p>Chargement des livres...</p>
      </div>
    );
  }

  return (
    <div className="livre-list">
      {/* Filtres et recherche */}
      <div className="filters-card">
        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">Recherche</label>
            <input
              type="text"
              placeholder="Rechercher par titre, auteur ou ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Genre</label>
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="filter-select"
            >
              <option value="">Tous les genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Disponibilité</label>
            <select
              value={filterDisponible}
              onChange={(e) => setFilterDisponible(e.target.value)}
              className="filter-select"
            >
              <option value="">Tous</option>
              <option value="true">Disponibles</option>
              <option value="false">Non disponibles</option>
            </select>
          </div>
          
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterGenre('');
              setFilterDisponible('');
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
        <p>{filteredLivres.length} livre(s) trouvé(s)</p>
      </div>

      {/* Liste des livres */}
      <div className="livres-grid">
        {filteredLivres.length === 0 ? (
          <div className="no-results">
            <p>Aucun livre trouvé</p>
          </div>
        ) : (
          filteredLivres.map(livre => (
            <div key={livre._id} className="livre-card">
              <div className="livre-header">
                <h3 className="livre-titre">{livre.titre}</h3>
                <span className={`status-badge ${livre.disponible ? 'disponible' : 'emprunte'}`}>
                  {livre.disponible ? '✅ Disponible' : '❌ Emprunté'}
                </span>
              </div>
              
              <div className="livre-details">
                <p><strong>Auteur:</strong> {livre.auteur}</p>
                <p><strong>ISBN:</strong> {livre.isbn}</p>
                <p><strong>Éditeur:</strong> {livre.editeur}</p>
                <p><strong>Année:</strong> {livre.anneePublication}</p>
                <p><strong>Genre:</strong> {livre.genre}</p>
                {livre.description && (
                  <p><strong>Description:</strong> {livre.description}</p>
                )}
              </div>
              
              <div className="livre-actions">
                <button 
                  onClick={() => onEdit(livre)}
                  className="btn btn-outline btn-sm"
                >
                  ✏️ Modifier
                </button>
                <button 
                  onClick={() => onDelete(livre._id)}
                  className="btn btn-danger btn-sm"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LivreList;