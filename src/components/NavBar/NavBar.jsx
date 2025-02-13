// src/components/NavBar/NavBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.info('👋 Déconnexion réussie.');
  };

  return (
    <nav className="nav-bar">
      <Link to="/">Accueil</Link>
      {!user ? (
        <>
          <Link to="/inscription">
            <button className="nav-button">Inscription</button>
          </Link>
          <Link to="/connexion">
            <button className="nav-button">Connexion</button>
          </Link>
        </>
      ) : (
        <>
          <Link to="/mon-profil">
            <button className="nav-button">Mon Profil</button>
          </Link>
          {location.pathname !== '/' && (
            <Link to="/map">
              <button className="nav-button">Carte</button>
            </Link>
          )}
          <button className="nav-button" onClick={handleLogout}>
            Se déconnecter
          </button>
        </>
      )}
    </nav>
  );
}

export default NavBar;
