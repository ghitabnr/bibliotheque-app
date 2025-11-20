import React from 'react';

const LivreItem = ({ livre, onEdit, onDelete }) => {
  return (
    <div className="livre-item">
      <div className="livre-info">
        <h3>{livre.titre}</h3>
        <p><strong>Auteur:</strong> {livre.auteur}</p>
        <p><strong>ISBN:</strong> {livre.isbn}</p>
        <p><strong>Disponible:</strong> {livre.disponible ? 'Oui' : 'Non'}</p>
      </div>
      <div className="livre-actions">
        <button onClick={() => onEdit(livre)} className="btn btn-outline">
          Modifier
        </button>
        <button onClick={() => onDelete(livre._id)} className="btn btn-danger">
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default LivreItem;