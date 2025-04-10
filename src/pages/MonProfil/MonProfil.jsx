import React, { useContext, useState, useEffect } from 'react';
import './MonProfil.css';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function MonProfil() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [wind, setWind] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [newCity, setNewCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/preferences/${user.id}`);
        if (response.data?.preferences) {
          const {
            temperature_threshold,
            humidity_threshold,
            wind_threshold,
            favorite_cities,
          } = response.data.preferences;

          setTemperature(temperature_threshold || '');
          setHumidity(humidity_threshold || '');
          setWind(wind_threshold || '');
          // Convertir les villes récupérées en minuscules pour normaliser
          setFavorites((favorite_cities || []).map(city => city.toLowerCase()));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des préférences', error);
        toast.error('❌ Impossible de charger les préférences.');
      }
    };

    if (user?.id) {
      fetchPreferences();
    }
  }, [user?.id]);

  const handleInputLimit = (value, min, max) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return '';
    return Math.max(min, Math.min(num, max));
  };

  const handleAddCity = () => {
    const trimmed = newCity.trim().toLowerCase();
    if (trimmed && !favorites.includes(trimmed)) {
      setFavorites([...favorites, trimmed]);
      setNewCity('');
    } else if (favorites.includes(trimmed)) {
      toast.warning('⚠️ Cette ville est déjà dans vos favoris.');
    }
  };

  const handleRemoveCity = (city) => {
    setFavorites(favorites.filter((fav) => fav !== city));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.put(`http://localhost:5000/api/users/${user.id}`, {
        name,
        email,
      });

      // Préparer les villes en minuscules avant l'envoi
      const lowerCaseFavorites = favorites.map((city) => city.toLowerCase());

      await axios.post('http://localhost:5000/api/preferences/update', {
        userId: user.id,
        temperature: parseInt(temperature, 10),
        humidity: parseInt(humidity, 10),
        wind: parseInt(wind, 10),
        favorite_cities: lowerCaseFavorites,
      });

      toast.success('✅ Informations et préférences mises à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      toast.error('❌ Erreur lors de la mise à jour.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      toast.info('👋 Déconnexion réussie.');
      navigate('/');
    }
  };

  if (!user) {
    return <p>Chargement des informations du profil...</p>;
  }

  return (
    <div className="mon-profil-container">
      <h1>Bienvenue sur votre profil, {user.name} !</h1>
      <form onSubmit={handleUpdate} className="profil-form">
        <div className="form-group">
          <label htmlFor="name">Nom :</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="temperature">Seuil de température (°C) :</label>
          <input
            id="temperature"
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(handleInputLimit(e.target.value, 0, 50))}
            min="0"
            max="50"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="humidity">Seuil d'humidité (%) :</label>
          <input
            id="humidity"
            type="number"
            value={humidity}
            onChange={(e) => setHumidity(handleInputLimit(e.target.value, 0, 100))}
            min="0"
            max="100"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="wind">Seuil du vent (km/h) :</label>
          <input
            id="wind"
            type="number"
            value={wind}
            onChange={(e) => setWind(handleInputLimit(e.target.value, 0, 100))}
            min="0"
            max="100"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="favorites">Villes favorites :</label>
          <div className="favorite-input-container">
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="Entrez une ville"
            />
            <button type="button" onClick={handleAddCity}>Ajouter</button>
          </div>
          <ul className="favorites-list">
            {favorites.map((city, index) => (
              <li key={index}>
                {city}
                <button type="button" onClick={() => handleRemoveCity(city)}>❌</button>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="update-button" disabled={isLoading}>
          {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
        </button>
      </form>

      <button className="logout-button" onClick={handleLogout}>
        Se déconnecter
      </button>
    </div>
  );
}

export default MonProfil;
