import React from 'react';
import './WeatherCard.css';

function WeatherCard({ weather }) {
  if (!weather) {
    return <p>Aucune donnée disponible.</p>;
  }

  const temp = weather.main?.temp ?? 'N/A';
  const humidity = weather.main?.humidity ?? 'N/A';
  const windSpeed = weather.wind?.speed ? Math.round(weather.wind.speed * 3.6) : 'N/A'; // Convertir m/s en km/h
  const description = weather.weather?.[0]?.description ?? 'Aucune condition disponible';

  return (
    <div className="weather-card">
      <h2>Météo à {weather.name}</h2>
      <p>Température : <strong>{Math.round(temp)}°C</strong></p>
      <p>Humidité : <strong>{humidity}%</strong></p>
      <p>Vitesse du vent : <strong>{windSpeed} km/h</strong></p>
      <p>Conditions : <strong>{description}</strong></p>
    </div>
  );
}

export default WeatherCard;
