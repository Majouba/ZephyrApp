import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Assure-toi que ce chemin est correct

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // ✅ Tu peux améliorer ici avec un vrai spinner si besoin
    return <p>Chargement en cours...</p>;
  }

  if (!user) {
    // ✅ Redirection vers /connexion si l'utilisateur n'est pas connecté
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  // ✅ L'utilisateur est authentifié : on affiche les enfants
  return children;
};

export default ProtectedRoute;
