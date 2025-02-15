// src/components/ForecastCard/ForecastCard.jsx
import React from 'react';
import './ForecastCard.css'; // Ajoute un fichier CSS pour le style

const ForecastCard = ({ forecast }) => {
  const { dt_txt, main, weather } = forecast;
  const date = new Date(dt_txt).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="forecast-card">
      <h3>{date}</h3>
      <p>Température : {Math.round(main.temp)}°C</p>
      <p>Conditions : {weather[0].description}</p>
    </div>
  );
};

export default ForecastCard;
