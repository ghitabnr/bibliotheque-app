import React from 'react';

const EmpruntItem = ({ emprunt, onRetour }) => {
  const isRetourPossible = emprunt.statut === 'emprunté' || emprunt.statut === 'en retard';

  return (
    <div className="emprunt-item">
      <div className="emprunt-info">
        <h3>{emprunt.livre?.titre}</h3>
        <p><strong>Membre:</strong> {emprunt.membre?.prenom} {emprunt.membre?.nom}</p>
        <p><strong>Date emprunt:</strong> {new Date(emprunt.dateEmprunt).toLocaleDateString('fr-FR')}</p>
        <p><strong>Retour prévu:</strong> {new Date(emprunt.dateRetourPrevue).toLocaleDateString('fr-FR')}</p>
        <p><strong>Statut:</strong> {emprunt.statut}</p>
      </div>
      <div className="emprunt-actions">
        {isRetourPossible && (
          <button onClick={() => onRetour(emprunt._id)} className="btn btn-success">
            Retourner
          </button>
        )}
      </div>
    </div>
  );
};

export default EmpruntItem;