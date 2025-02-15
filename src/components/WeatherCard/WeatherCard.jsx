import React from 'react';
import './WeatherCard.css';

function WeatherCard({ weather }) {
  if (!weather) {
    return <p className="no-data">Aucune donnée disponible.</p>;
  }

  const temp = weather.main?.temp;
  const humidity = weather.main?.humidity;
  const windSpeed = weather.wind?.speed ? Math.round(weather.wind.speed * 3.6) : null; // Convertir m/s en km/h
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
    </div>
  );
}

export default WeatherCard;
