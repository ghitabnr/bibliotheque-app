import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Tableau de Bord', icon: '📊' },
    { path: '/livres', label: 'Livres', icon: '📚' },
    { path: '/membres', label: 'Membres', icon: '👥' },
    { path: '/emprunts', label: 'Emprunts', icon: '🔄' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-items">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;