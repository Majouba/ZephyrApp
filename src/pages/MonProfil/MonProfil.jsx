import React, { useContext, useState } from 'react';
import './MonProfil.css';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MonProfil() {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email) {
      toast.warn('⚠️ Veuillez remplir tous les champs.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/users/${user.id}`, { name, email });
      setUser(response.data.user);
      toast.success('✅ Informations mises à jour avec succès !');
    } catch (error) {
      console.error('Erreur de mise à jour :', error);
      toast.error('❌ Erreur lors de la mise à jour.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('👋 Déconnexion réussie.');
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
            <label htmlFor="name">Nom :</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email :</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="update-button" disabled={isLoading}>
            {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </form>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Se déconnecter
      </button>
    </div>
  );
}

export default MonProfil;
