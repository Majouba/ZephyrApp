import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assure-toi que le chemin est correct

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Affiche un message ou un loader pendant la vérification
    return <p>Chargement en cours...</p>;
  }

  if (!user) {
    // Redirige vers la page de connexion et conserve la route d'origine
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
