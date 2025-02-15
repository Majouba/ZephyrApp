import React, { useState } from 'react';
import './App.css';
import WeatherService from './services/WeatherService';
import WeatherCard from './components/WeatherCard/WeatherCard';
import ForecastCard from './components/ForecastCard/ForecastCard';
import SearchInput from './components/SearchInputs/SearchInput'; // Correction ici
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import NavBar from './components/Common/NavBar/NavBar'; // Correction ici
import MapPage from './pages/MapPage/MapPage';
import Connexion from './pages/Connexion/Connexion';
import Inscription from './pages/Inscription/Inscription';
import MonProfil from './pages/MonProfil/MonProfil';
import ProtectedRoute from './utils/ProtectedRoute';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user, loading } = useAuth();
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null); // Prévision pour demain, initialisée à null

  const fetchWeather = async () => {
    if (!city.trim()) {
      toast.warn('⚠️ Veuillez entrer le nom d\'une ville.');
      setWeather(null);
      setForecast(null);
      return;
    }

    try {
      const weatherData = await WeatherService.getWeatherByCity(city);
      setWeather(weatherData);
      toast.success('🌞 Météo actuelle récupérée avec succès !');

      const forecastData = await WeatherService.getForecastByCity(city);
      setForecast(forecastData[0]); // Utiliser uniquement la première prévision pour demain
      toast.success('📅 Prévision pour demain récupérée avec succès !');
    } catch (err) {
      console.error(err);
      setWeather(null);
      setForecast(null);
      toast.error('❌ Erreur lors de la récupération des données météo.');
    }
  };

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <Router>
      <div className="container">
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              <div className="home-page">
                <h1>Météo en direct</h1>
                <div className="search-section">
                  <SearchInput city={city} setCity={setCity} onSearch={fetchWeather} />
                  {user && (
                    <button className="map-button" onClick={() => toast.info('La carte arrive bientôt !')}>
                      Carte
                    </button>
                  )}
                </div>
                {weather && <WeatherCard weather={weather} />}
                {forecast && (
                  <div className="forecast-section">
                    <h2>Prévision pour demain</h2>
                    <div className="forecast-list">
                      <ForecastCard forecast={forecast} />
                    </div>
                  </div>
                )}
              </div>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            }
          />
          <Route path="/connexion" element={user ? <Navigate to="/mon-profil" replace /> : <Connexion />} />
          <Route path="/inscription" element={user ? <Navigate to="/mon-profil" replace /> : <Inscription />} />
          <Route
            path="/mon-profil"
            element={
              <ProtectedRoute>
                <MonProfil />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
      </div>
    </Router>
  );
}

export default App;
