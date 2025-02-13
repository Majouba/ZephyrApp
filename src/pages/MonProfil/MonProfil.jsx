import React, { useContext, useState } from 'react';
import './MonProfil.css';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MonProfil() {
  const { user, logout, setUser } = useContext(AuthContext); // setUser pour mettre à jour les infos utilisateur
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${user.id}`, { name, email });
      setUser(response.data.user); // Mise à jour des infos dans le contexte
      setMessage('✅ Informations mises à jour avec succès !');
    } catch (error) {
      setMessage('❌ Erreur lors de la mise à jour.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <p>Chargement des informations du profil...</p>;
  }

  return (
    <div className="mon-profil-container">
      <h1>Bienvenue sur votre profil, {user.name} !</h1>
      <div className="profil-details">
        <form onSubmit={handleUpdate}>
          <div>
            <label>Nom :</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="update-button">Mettre à jour</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Se déconnecter
      </button>
    </div>
  );
}

export default MonProfil;
