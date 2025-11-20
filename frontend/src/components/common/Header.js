import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authUtils } from '../../services/auth';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const user = authUtils.getUser();

  const handleLogout = () => {
    authUtils.logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>📚 Bibliothèque</h1>
          </Link>
          
          <nav className="nav">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">Tableau de Bord</Link>
                <Link to="/livres" className="nav-link">Livres</Link>
                <Link to="/membres" className="nav-link">Membres</Link>
                <Link to="/emprunts" className="nav-link">Emprunts</Link>
                <div className="user-menu">
                  <span className="user-name">Bonjour, {user.nom}</span>
                  <button onClick={handleLogout} className="btn btn-outline">
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="nav-link">Connexion</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;