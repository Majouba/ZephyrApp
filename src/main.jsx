// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';          // Fichier CSS principal
import 'leaflet/dist/leaflet.css';  // Import du CSS de Leaflet
import App from './App';
import { AuthProvider } from './context/AuthContext';  // Import du AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>  {/* Enveloppement de l'application */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
