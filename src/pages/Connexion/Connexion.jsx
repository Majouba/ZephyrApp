import React, { useState } from 'react';
import './Connexion.css';
import { useNavigate } from 'react-router-dom'; // Importation du hook useNavigate

function Connexion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialisation de useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation et soumission du formulaire
    if (!username || !password) {
      setError('Tous les champs sont requis');
    } else {
      setError('');
      // Simuler une connexion réussie
      setTimeout(() => {
        navigate('/'); // Redirection vers la page d'accueil après la connexion
      }, 1000); // Attente de 1 seconde avant la redirection
    }
  };

  return (
    <div className="connexion-container">
      <h1>Connexion</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Nom d'utilisateur" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit">Se connecter</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default Connexion;
