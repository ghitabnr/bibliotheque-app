import React from 'react';

const MembreItem = ({ membre, onEdit, onDelete }) => {
  return (
    <div className="membre-item">
      <div className="membre-info">
        <h3>{membre.prenom} {membre.nom}</h3>
        <p><strong>Numéro:</strong> {membre.numeroMembre}</p>
        <p><strong>Email:</strong> {membre.email}</p>
        <p><strong>Statut:</strong> {membre.statut}</p>
      </div>
      <div className="membre-actions">
        <button onClick={() => onEdit(membre)} className="btn btn-outline">
          Modifier
        </button>
        <button onClick={() => onDelete(membre._id)} className="btn btn-danger">
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default MembreItem;