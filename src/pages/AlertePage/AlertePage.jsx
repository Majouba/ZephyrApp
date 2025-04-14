// src/pages/AlertePage.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AlertePage.css';
import { getDisasterAlerts } from '../../services/gdacsService';
import { getCountryNameFromCode } from '../../utils/countryUtils';

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
        const gdacsData = await getDisasterAlerts();

        const promises = favorite_cities.map(async (city) => {
          try {
            const encodedCity = encodeURIComponent(city.toLowerCase().trim());

            const weatherRes = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&lang=fr&appid=${API_KEY}`
            );

            const { temp, humidity } = weatherRes.data.main;
            const wind = weatherRes.data.wind?.speed || 0;
            const condition = weatherRes.data.weather[0].description;
            const countryCode = weatherRes.data.sys?.country || '';
            const countryName = getCountryNameFromCode(countryCode);

            const actualTotal = temp + humidity + wind;
            const percent = (actualTotal / totalThreshold) * 100;

            let alertLevel = 'green';
            if (percent >= 80) alertLevel = 'red';
            else if (percent > 35) alertLevel = 'orange';

            const matchedGDACS = gdacsData.find(alert =>
              alert.countries.some(c => c.toLowerCase().includes(countryName?.toLowerCase()))
            );

            return {
              city,
              temp,
              humidity,
              wind,
              condition,
              alertLevel,
              percent: percent.toFixed(1),
              gdacs: matchedGDACS || null
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

  const traduireTitre = (titre) => {
    if (!titre) return '';
    return titre
      .replace('Drought is on going in', 'Une sécheresse est en cours en')
      .replace('Flood is on going in', 'Une inondation est en cours en')
      .replace('Earthquake is on going in', 'Un tremblement de terre est en cours en')
      .replace('Cyclone is on going in', 'Un cyclone est en cours en');
  };

  const traduireDescription = (desc) => {
    if (!desc) return '';
    return desc
      .replace(/The Drought alert level is Green\.?/, 'Le niveau d\'alerte sécheresse est Vert.')
      .replace(/The Drought alert level is Orange\.?/, 'Le niveau d\'alerte sécheresse est Orange.')
      .replace(/The Drought alert level is Red\.?/, 'Le niveau d\'alerte sécheresse est Rouge.')
      .replace(/The Flood alert level is Green\.?/, 'Le niveau d\'alerte inondation est Vert.')
      .replace(/The Flood alert level is Orange\.?/, 'Le niveau d\'alerte inondation est Orange.')
      .replace(/The Flood alert level is Red\.?/, 'Le niveau d\'alerte inondation est Rouge.')
      .replace(/The Earthquake alert level is Green\.?/, 'Le niveau d\'alerte séisme est Vert.')
      .replace(/The Earthquake alert level is Orange\.?/, 'Le niveau d\'alerte séisme est Orange.')
      .replace(/The Earthquake alert level is Red\.?/, 'Le niveau d\'alerte séisme est Rouge.')
      .replace(/The Cyclone alert level is Green\.?/, 'Le niveau d\'alerte cyclone est Vert.')
      .replace(/The Cyclone alert level is Orange\.?/, 'Le niveau d\'alerte cyclone est Orange.')
      .replace(/The Cyclone alert level is Red\.?/, 'Le niveau d\'alerte cyclone est Rouge.');
  };

  return (
    <div className="alert-page">
      <h1>📡 Alertes Météo</h1>

      {hasPreferences && alerts.length > 0 && (
        <p className="alert-explanation">
          Le niveau d’alerte est basé sur la somme de vos seuils de tolérance définis (température, humidité, vent).
          Si les conditions actuelles atteignent plus de <strong>80%</strong>, la carte devient <span style={{ color: '#c0392b' }}><strong>rouge</strong></span>,
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

              {a.gdacs ? (
                <div className="gdacs-alert">
                  <p>🚨 <strong>Catastrophe détectée</strong></p>
                  <p>{traduireTitre(a.gdacs.title)}</p>
                  <p>{traduireDescription(a.gdacs.description)}</p>
                  {a.gdacs.link && (
                    <p>
                      🔗 <a href={a.gdacs.link} target="_blank" rel="noopener noreferrer">
                        Voir plus d'infos
                      </a>
                    </p>
                  )}
                </div>
              ) : (
                <p className="no-disaster">✅ Aucun événement catastrophique signalé dans ce pays.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlertePage;
