// src/context/AuthContext.jsx
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stocke les informations de l'utilisateur connecté

  const login = (userData) => setUser(userData);  // Fonction pour connecter l'utilisateur
  const logout = () => setUser(null);             // Fonction pour déconnecter l'utilisateur

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
