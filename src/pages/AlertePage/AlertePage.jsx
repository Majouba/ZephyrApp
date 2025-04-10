import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AlertePage.css';

function AlertePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPreferences, setHasPreferences] = useState(true);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
      return;
    }

    const fetchAlerts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/preferences/${user.id}`);
        const {
          temperature_threshold,
          humidity_threshold,
          wind_threshold,
          favorite_cities
        } = res.data.preferences;

        if (
          !temperature_threshold ||
          !humidity_threshold ||
          !wind_threshold ||
          !Array.isArray(favorite_cities) ||
          favorite_cities.length === 0
        ) {
          setHasPreferences(false);
          setLoading(false);
          return;
        }

        const totalThreshold = temperature_threshold + humidity_threshold + wind_threshold;

        const promises = favorite_cities.map(async (city) => {
          try {
            const encodedCity = encodeURIComponent(city.toLowerCase().trim());

            const weatherRes = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&lang=fr&appid=${API_KEY}`
            );            

            const { temp, humidity } = weatherRes.data.main;
            const wind = weatherRes.data.wind?.speed || 0;
            const condition = weatherRes.data.weather[0].description;

            const actualTotal = temp + humidity + wind;
            const percent = (actualTotal / totalThreshold) * 100;

            let alertLevel = 'green';
            if (percent >= 80) alertLevel = 'red';
            else if (percent > 35) alertLevel = 'orange';

            return {
              city,
              temp,
              humidity,
              wind,
              condition,
              alertLevel,
              percent: percent.toFixed(1)
            };
          } catch (err) {
            console.warn(`🌍 Erreur pour la ville "${city}" :`, err.message);
            return null;
          }
        });

        const data = (await Promise.all(promises)).filter(Boolean);
        setAlerts(data);
      } catch (err) {
        console.error('❌ Erreur lors du chargement des alertes météo :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [user, navigate, API_KEY]);

  const goToPreferences = () => {
    navigate('/mon-profil');
  };

  return (
    <div className="alert-page">
      <h1>📡 Alertes Météo</h1>

      {/* ✅ Explication visible uniquement si préférences valides */}
      {hasPreferences && alerts.length > 0 && (
        <p className="alert-explanation">
          Le niveau d’alerte est basé sur la somme de vos seuils de tolérance définis (température, humidité, vent).
          Si les conditions actuelles atteignent plus de <strong>80%</strong> de cette somme, la carte devient <span style={{ color: '#c0392b' }}><strong>rouge</strong></span>,
          au-delà de <strong>35%</strong> elle est <span style={{ color: '#f39c12' }}><strong>orange</strong></span>, et en dessous elle reste <span style={{ color: '#27ae60' }}><strong>verte</strong></span>.
        </p>
      )}

      {loading ? (
        <p>Chargement des données météo...</p>
      ) : !hasPreferences || alerts.length === 0 ? (
        <div className="no-preferences">
          <p>🚫 Vous n'avez défini aucune ville ni seuils de tolérance.</p>
          <button className="set-preferences-button" onClick={goToPreferences}>
            ➕ Ajouter des préférences
          </button>
        </div>
      ) : (
        <div className="alert-list">
          {alerts.map((a, index) => (
            <div className={`alert-card ${a.alertLevel}`} key={index}>
              <h2>{a.city}</h2>
              <p>🌡 Température : {Math.round(a.temp)}°C</p>
              <p>💧 Humidité : {a.humidity}%</p>
              <p>💨 Vent : {Math.round(a.wind)} km/h</p>
              <p>☁️ Conditions : {a.condition}</p>
              <p>⚠️ Niveau d'alerte : {a.percent}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlertePage;
