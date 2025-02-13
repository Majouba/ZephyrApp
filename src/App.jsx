import React, { useState } from 'react';
import './App.css';
import WeatherService from './services/WeatherService';
import WeatherCard from './components/WeatherCard/WeatherCard';
import SearchInput from './components/SearchInput/SearchInput';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import du contexte Auth
import MapPage from './pages/MapPage/MapPage';
import Connexion from './pages/Connexion/Connexion';
import Inscription from './pages/Inscription/Inscription';
import MonProfil from './pages/MonProfil/MonProfil';

function App() {
  const { user, logout } = useAuth(); // Accès au contexte d'authentification
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('❌ Localisation non trouvée. Veuillez entrer le nom d\'une ville et vérifier l’orthographe.');
      setWeather(null);
      return;
    }

    try {
      const data = await WeatherService.getWeatherByCity(city);
      setWeather(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('❌ Localisation non trouvée. Veuillez entrer le nom d\'une ville et vérifier l’orthographe.');
      setWeather(null);
    }
  };

  return (
    <Router>
      <div className="container">
        <nav className="nav-bar">
          <Link to="/">Accueil</Link>
          {!user ? (
            <>
              <Link to="/inscription">
                <button className="nav-button">Inscription</button>
              </Link>
              <Link to="/connexion">
                <button className="nav-button">Connexion</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/mon-profil">
                <button className="nav-button">Mon Profil</button>
              </Link>
              <button className="nav-button" onClick={logout}>
                Se déconnecter
              </button>
            </>
          )}
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Météo en direct</h1>
                <div className="search-section">
                  <SearchInput city={city} setCity={setCity} onSearch={fetchWeather} />
                  <Link to="/map">
                    <button className="map-button">Carte</button>
                  </Link>
                </div>
                {weather && <WeatherCard weather={weather} />}
                {error && <p className="error-message">{error}</p>}
              </>
            }
          />
          <Route path="/map" element={<MapPage />} />
          <Route path="/connexion" element={user ? <Navigate to="/mon-profil" /> : <Connexion />} />
          <Route path="/inscription" element={user ? <Navigate to="/mon-profil" /> : <Inscription />} />
          <Route path="/mon-profil" element={user ? <MonProfil /> : <Navigate to="/connexion" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
