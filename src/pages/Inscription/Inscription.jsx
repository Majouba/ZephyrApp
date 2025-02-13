import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Inscription.css'; // Assurez-vous d'avoir un fichier CSS associé

function Inscription() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // État pour le loader
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Active le loader

    try {
      await axios.post('http://localhost:5000/api/register', {
        username,
        email,
        password,
      });

      toast.success('✅ Inscription réussie ! Redirection vers la page de connexion...');
      setTimeout(() => {
        navigate('/connexion');
      }, 3000); // Redirection après 3 secondes
    } catch (err) {
      console.error(err);
      toast.error('❌ Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false); // Désactive le loader
    }
  };

  return (
    <div className="inscription-container">
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom d'utilisateur :</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Entrez votre nom d'utilisateur"
            required
          />
        </div>
        <div className="form-group">
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre adresse email"
            required
          />
        </div>
        <div className="form-group">
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>
    </div>
  );
}

export default Inscription;
