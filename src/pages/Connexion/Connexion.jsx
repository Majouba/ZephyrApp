import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './Connexion.css';

const Connexion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirection si l'utilisateur est déjà connecté
  if (user) {
    navigate('/mon-profil', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('❌ Tous les champs sont requis');
      toast.error('❌ Tous les champs sont requis');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      login(response.data.user);
      toast.success('✅ Connexion réussie ! Redirection en cours...');
      
      // Redirection dynamique vers la page initialement demandée
      const from = location.state?.from?.pathname || '/mon-profil';
      navigate(from, { replace: true });

    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        setErrorMessage('❌ Identifiants incorrects.');
        toast.error('❌ Identifiants incorrects.');
      } else {
        setErrorMessage('❌ Une erreur est survenue. Veuillez réessayer.');
        toast.error('❌ Une erreur est survenue.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="connexion-container">
      <h1>Connexion</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input
              id="email"
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <input
              id="password"
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && (
            <div role="alert" aria-live="assertive" className="error-message">
              {errorMessage}
            </div>
          )}
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Connexion;
