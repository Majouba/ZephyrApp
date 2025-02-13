import React from 'react';
import { render, screen } from '@testing-library/react'; // Import essentiel
import '@testing-library/jest-dom'; // Pour des assertions avancées comme toBeInTheDocument
import WeatherCard from '../components/WeatherCard/WeatherCard'; // Import du composant à tester

describe('WeatherCard Component', () => {
  const mockWeatherData = {
    name: 'Paris',
    main: { temp: 22, humidity: 65 },
    wind: { speed: 5 }, // 5 m/s -> 18 km/h
    weather: [{ description: 'ciel dégagé' }],
  };

  test('renders weather information correctly', () => {
    render(<WeatherCard weather={mockWeatherData} />);

    expect(screen.getByText(/Météo à Paris/i)).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element.textContent === 'Température : 22°C')
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element.textContent === 'Humidité : 65%')
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element.textContent === 'Vitesse du vent : 18 km/h')
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element.textContent === 'Conditions : ciel dégagé')
    ).toBeInTheDocument();
  });

  test('renders with missing humidity and wind speed', () => {
    const incompleteWeatherData = {
      name: 'Lyon',
      main: { temp: 18 },
      wind: {},
      weather: [{ description: 'partiellement nuageux' }],
    };

    render(<WeatherCard weather={incompleteWeatherData} />);

    expect(screen.getByText(/Météo à Lyon/i)).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element.textContent === 'Température : 18°C')
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element.textContent === 'Humidité : N/A%')
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element.textContent === 'Vitesse du vent : N/A km/h')
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element.textContent === 'Conditions : partiellement nuageux')
    ).toBeInTheDocument();
  });

  test('renders "Aucune donnée disponible" when weather is undefined', () => {
    render(<WeatherCard weather={undefined} />);
    expect(screen.getByText(/Aucune donnée disponible/i)).toBeInTheDocument();
  });
});
