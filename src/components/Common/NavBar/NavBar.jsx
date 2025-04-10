// src/components/Common/NavBar/NavBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import './NavBar.css';

function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.info('👋 Déconnexion réussie.');
  };

  return (
    <nav className="nav-bar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">Accueil</Link>
        </li>

        {!user ? (
          <>
            <li className="nav-item">
              <Link to="/inscription" className="nav-link">
                <button className="nav-button">Inscription</button>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/connexion" className="nav-link">
                <button className="nav-button">Connexion</button>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/mon-profil" className="nav-link">
                <button className="nav-button">Mon Profil</button>
              </Link>
            </li>

            {location.pathname !== '/alerte' && (
              <li className="nav-item">
                <Link to="/alerte" className="nav-link">
                  <button className="nav-button">Alertes</button>
                </Link>
              </li>
            )}

            <li className="nav-item">
              <button className="nav-button" onClick={handleLogout}>
                Se déconnecter
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
