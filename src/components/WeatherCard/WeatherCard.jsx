// src/components/WeatherCard/WeatherCard.jsx
import React, { useEffect, useState } from 'react';
import './WeatherCard.css';
import { getDisasterAlerts } from '../../services/gdacsService';
import { getCountryNameFromCode, traduireAlerte } from '../../utils/countryUtils'; // ✅

function WeatherCard({ weather }) {
  const [gdacsAlert, setGdacsAlert] = useState(null);
  const [gdacsChecked, setGdacsChecked] = useState(false);

  useEffect(() => {
    const fetchGdacs = async () => {
      if (!weather || !weather.sys?.country) return;

      try {
        const alerts = await getDisasterAlerts();
        const countryName = getCountryNameFromCode(weather.sys.country); // 🇫🇷 nom du pays

        if (!alerts || !Array.isArray(alerts)) {
          setGdacsAlert(null);
          setGdacsChecked(true);
          return;
        }

        const matched = alerts.find(alert =>
          Array.isArray(alert.countries) &&
          alert.countries.some(country =>
            country.toLowerCase().includes(countryName?.toLowerCase())
          )
        );

        setGdacsAlert(matched || null);
      } catch (error) {
        console.error('Erreur lors de la vérification GDACS :', error);
        setGdacsAlert(null);
      } finally {
        setGdacsChecked(true);
      }
    };

    fetchGdacs();
  }, [weather]);

  if (!weather) {
    return <p className="no-data">Aucune donnée disponible.</p>;
  }

  const temp = weather.main?.temp;
  const humidity = weather.main?.humidity;
  const windSpeed = weather.wind?.speed ? Math.round(weather.wind.speed * 3.6) : null;
  const description = weather.weather?.[0]?.description;

  return (
    <div className="weather-card">
      <h2>Météo à {weather.name}</h2>
      <div className="weather-detail">
        {temp !== undefined && <p>Température : <strong>{Math.round(temp)}°C</strong></p>}
        {humidity !== undefined && <p>Humidité : <strong>{humidity}%</strong></p>}
        {windSpeed !== null && <p>Vitesse du vent : <strong>{windSpeed} km/h</strong></p>}
        {description && <p>Conditions : <strong>{description}</strong></p>}
      </div>

      {gdacsChecked && (
        gdacsAlert ? (
          <div className="gdacs-alert">
            <p>🚨 <strong>Catastrophe détectée</strong></p>
            <p>{traduireAlerte(gdacsAlert.title)}</p>
            <p>{traduireAlerte(gdacsAlert.description)}</p>
            {gdacsAlert.link && (
              <p>
                🔗 <a href={gdacsAlert.link} target="_blank" rel="noopener noreferrer">
                  Voir plus d'infos
                </a>
              </p>
            )}
          </div>
        ) : (
          <p className="no-disaster">✅ Aucun événement catastrophique signalé dans ce pays.</p>
        )
      )}
    </div>
  );
}

export default WeatherCard;
