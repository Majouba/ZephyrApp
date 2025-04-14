import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Inscription.css';

function Inscription() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const lengthCheck = pwd.length >= 12;
    const upperCheck = /[A-Z]/.test(pwd);
    const lowerCheck = /[a-z]/.test(pwd);
    const numberCheck = /[0-9]/.test(pwd);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    return lengthCheck && (upperCheck + lowerCheck + numberCheck + specialCharCheck >= 3);
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setIsPasswordValid(validatePassword(pwd));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!isPasswordValid) {
      setErrorMessage('❌ Le mot de passe ne respecte pas les règles de sécurité.');
      toast.error('❌ Mot de passe non conforme.');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/register', { username, email, password });
      toast.success('✅ Inscription réussie ! Redirection vers la page de connexion...');
      navigate('/connexion');
    } catch (error) {
      console.error(error);
      setErrorMessage('❌ Erreur lors de l\'inscription. Veuillez vérifier vos informations.');
      toast.error('❌ Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inscription-container">
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur :</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Entrez votre nom d'utilisateur"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre adresse email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-group">Mot de passe :</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Entrez votre mot de passe"
            required
          />
          <p className={`password-rules ${isPasswordValid ? 'valid' : 'invalid'}`}>
            Le mot de passe doit contenir au moins 12 caractères et inclure 3 des catégories suivantes :
            lettres majuscules, lettres minuscules, chiffres, caractères spéciaux.
          </p>
        </div>
        {errorMessage && (
          <div role="alert" aria-live="assertive" className="error-message">
            {errorMessage}
          </div>
        )}
        <button type="submit" className="submit-button" disabled={isLoading || !isPasswordValid}>
          {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>
    </div>
  );
}

export default Inscription;