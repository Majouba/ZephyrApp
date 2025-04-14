// src/components/ForecastCard/ForecastCard.jsx
import React, { useEffect, useState } from 'react';
import './ForecastCard.css';
import { getDisasterAlerts } from '../../services/gdacsService';
import { getCountryNameFromCode } from '../../utils/countryUtils';

const ForecastCard = ({ forecast, countryCode }) => {
  const [gdacsAlert, setGdacsAlert] = useState(null);
  const [gdacsChecked, setGdacsChecked] = useState(false); // 👈 ajouté pour vérifier si l’appel est terminé

  const date = new Date(forecast.dt_txt).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // ✅ Traduction contextuelle du titre
  const traduireTitre = (titre) => {
    if (!titre) return '';
    const clean = titre.replace(/\s+/g, ' ').trim();
    return clean
      .replace('Drought is on going in', 'Une sécheresse est en cours en')
      .replace('Flood is on going in', 'Une inondation est en cours en')
      .replace('Earthquake is on going in', 'Un tremblement de terre est en cours en')
      .replace('Cyclone is on going in', 'Un cyclone est en cours en');
  };

  // ✅ Traduction contextuelle de la description
  const traduireDescription = (desc) => {
    if (!desc) return '';
    const clean = desc.replace(/\s+/g, ' ').trim();
    return clean
      .replace('The Drought alert level is Green.', 'Le niveau d\'alerte sécheresse est Vert.')
      .replace('The Drought alert level is Orange.', 'Le niveau d\'alerte sécheresse est Orange.')
      .replace('The Drought alert level is Red.', 'Le niveau d\'alerte sécheresse est Rouge.')
      .replace('The Flood alert level is Green.', 'Le niveau d\'alerte inondation est Vert.')
      .replace('The Flood alert level is Orange.', 'Le niveau d\'alerte inondation est Orange.')
      .replace('The Flood alert level is Red.', 'Le niveau d\'alerte inondation est Rouge.')
      .replace('The Earthquake alert level is Green.', 'Le niveau d\'alerte séisme est Vert.')
      .replace('The Earthquake alert level is Orange.', 'Le niveau d\'alerte séisme est Orange.')
      .replace('The Earthquake alert level is Red.', 'Le niveau d\'alerte séisme est Rouge.')
      .replace('The Cyclone alert level is Green.', 'Le niveau d\'alerte cyclone est Vert.')
      .replace('The Cyclone alert level is Orange.', 'Le niveau d\'alerte cyclone est Orange.')
      .replace('The Cyclone alert level is Red.', 'Le niveau d\'alerte cyclone est Rouge.');
  };

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const alerts = await getDisasterAlerts();
        const countryName = getCountryNameFromCode(countryCode);

        const matched = alerts.find(alert =>
          alert.countries.some(c => c.toLowerCase().includes(countryName?.toLowerCase()))
        );

        setGdacsAlert(matched || null);
      } catch (error) {
        console.error('Erreur GDACS dans ForecastCard :', error);
        setGdacsAlert(null);
      } finally {
        setGdacsChecked(true); // 👈 déclencher l’affichage une fois terminé
      }
    };

    if (countryCode) {
      fetchAlert();
    }
  }, [countryCode]);

  return (
    <div className="forecast-card">
      <h3>{date}</h3>
      <p>Température : {Math.round(forecast.main.temp)}°C</p>
      <p>Humidité : {forecast.main.humidity}%</p>
      <p>Vitesse du vent : {Math.round(forecast.wind.speed)} km/h</p>
      <p>Conditions : {forecast.weather[0].description}</p>

      {/* ✅ Affichage conditionnel basé sur GDACS */}
      {gdacsChecked && (
        gdacsAlert ? (
          <div className="gdacs-alert">
            <p>🚨 <strong>Catastrophe détectée</strong></p>
            <p>{traduireTitre(gdacsAlert.title)}</p>
            <p>{traduireDescription(gdacsAlert.description)}</p>
            {gdacsAlert.link && (
              <p>
                🔗 <a href={gdacsAlert.link} target="_blank" rel="noopener noreferrer">
                  👉 Plus de détails sur GDACS
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
};

export default ForecastCard;
