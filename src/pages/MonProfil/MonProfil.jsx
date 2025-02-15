import React, { useContext, useState, useEffect } from 'react';
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
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [wind, setWind] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastNotification, setLastNotification] = useState({}); // Pour limiter les notifications répétées

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/preferences/${user.id}`);
        if (response.data && response.data.preferences) {
          setTemperature(response.data.preferences.temperature_threshold || '');
          setHumidity(response.data.preferences.humidity_threshold || '');
          setWind(response.data.preferences.wind_threshold || '');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des préférences', error);
        toast.error('❌ Impossible de charger les préférences.');
      }
    };
    fetchPreferences();
  }, [user.id]);

  const handleInputLimit = (value, min, max, field) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return '';

    const now = Date.now();
    const delay = 2000; // Délai de 2 secondes entre les notifications

    if (num < min) {
      if (!lastNotification[field] || now - lastNotification[field] > delay) {
        toast.info(`⚠️ La valeur de ${field} a été ajustée à ${min}.`);
        setLastNotification((prev) => ({ ...prev, [field]: now }));
      }
      return min;
    }
    if (num > max) {
      if (!lastNotification[field] || now - lastNotification[field] > delay) {
        toast.info(`⚠️ La valeur de ${field} a été ajustée à ${max}.`);
        setLastNotification((prev) => ({ ...prev, [field]: now }));
      }
      return max;
    }
    return num;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email) {
      toast.warn('⚠️ Veuillez remplir tous les champs.');
      setIsLoading(false);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/users/${user.id}`, { name, email });
      await axios.post('http://localhost:5000/api/preferences/update', {
        userId: user.id,
        temperature: parseInt(temperature, 10),
        humidity: parseInt(humidity, 10),
        wind: parseInt(wind, 10),
      });
      toast.success('✅ Informations et seuils mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
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
          <div>
            <label htmlFor="temperature">Seuil de température (°C) :</label>
            <input
              id="temperature"
              type="number"
              value={temperature}
              onChange={(e) =>
                setTemperature(handleInputLimit(e.target.value, 0, 50, 'la température'))
              }
              min="0"
              max="50"
              required
            />
          </div>
          <div>
            <label htmlFor="humidity">Seuil d'humidité (%) :</label>
            <input
              id="humidity"
              type="number"
              value={humidity}
              onChange={(e) =>
                setHumidity(handleInputLimit(e.target.value, 0, 100, 'l\'humidité'))
              }
              min="0"
              max="100"
              required
            />
          </div>
          <div>
            <label htmlFor="wind">Seuil du vent (km/h) :</label>
            <input
              id="wind"
              type="number"
              value={wind}
              onChange={(e) => setWind(handleInputLimit(e.target.value, 0, 100, 'le vent'))}
              min="0"
              max="100"
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
