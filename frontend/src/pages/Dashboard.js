import React, { useState, useEffect } from 'react';
import { livreService, membreService, empruntService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLivres: 0,
    totalMembres: 0,
    empruntsActifs: 0,
    empruntsRetard: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const [livresRes, membresRes, empruntsRes, retardRes] = await Promise.all([
          livreService.getAll(),
          membreService.getAll(),
          empruntService.getAll({ statut: 'emprunté' }),
          empruntService.getEnRetard()
        ]);

        setStats({
          totalLivres: livresRes.count,
          totalMembres: membresRes.count,
          empruntsActifs: empruntsRes.count,
          empruntsRetard: retardRes.count
        });
      } catch (error) {
        setError('Erreur lors du chargement des statistiques');
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Tableau de Bord</h1>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalLivres}</div>
          <div className="stat-label">Livres Total</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.totalMembres}</div>
          <div className="stat-label">Membres Actifs</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.empruntsActifs}</div>
          <div className="stat-label">Emprunts en Cours</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.empruntsRetard}</div>
          <div className="stat-label">Emprunts en Retard</div>
        </div>
      </div>

      {/* Sections rapides */}
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>Gestion Rapide</h2>
          <div className="quick-actions">
            <div className="quick-action">
              <h3>📚 Livres</h3>
              <p>Gérer le catalogue des livres</p>
              <a href="/livres" className="btn btn-primary">Voir les livres</a>
            </div>
            
            <div className="quick-action">
              <h3>👥 Membres</h3>
              <p>Gérer les membres de la bibliothèque</p>
              <a href="/membres" className="btn btn-primary">Voir les membres</a>
            </div>
            
            <div className="quick-action">
              <h3>🔄 Emprunts</h3>
              <p>Gérer les emprunts et retours</p>
              <a href="/emprunts" className="btn btn-primary">Voir les emprunts</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;