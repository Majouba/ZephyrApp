// src/components/Common/NavBar/NavBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Chemin corrigé
import { toast } from 'react-toastify';
import './NavBar.css'; // Import des styles spécifiques

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
              <Link to="/inscription">
                <button className="nav-button">Inscription</button>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/connexion">
                <button className="nav-button">Connexion</button>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/mon-profil">
                <button className="nav-button">Mon Profil</button>
              </Link>
            </li>
            {location.pathname !== '/' && (
              <li className="nav-item">
                <Link to="/map">
                  <button className="nav-button">Carte</button>
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
