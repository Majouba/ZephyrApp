import React, { useState } from 'react';
import './App.css';
import WeatherService from './services/WeatherService';
import WeatherCard from './components/WeatherCard/WeatherCard';
import SearchInput from './components/SearchInput/SearchInput';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MapPage from './pages/MapPage/MapPage'; // Page de la carte
import Connexion from './pages/Connexion/Connexion'; // Page de connexion
import Inscription from './pages/Inscription/Inscription'; // Page d'inscription

function App() {
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
        <Routes>
          {/* Page d'accueil : Recherche et météo */}
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
                  <Link to="/connexion">
                    <button className="connexion-button">Connexion</button>
                  </Link>
                  <Link to="/inscription">
                    <button className="inscription-button">Inscription</button>
                  </Link>
                </div>

                {weather && <WeatherCard weather={weather} />}
                {error && <p className="error-message">{error}</p>}
              </>
            }
          />

          {/* Page Carte : uniquement la carte */}
          <Route path="/map" element={<MapPage />} />
          
          {/* Page Connexion */}
          <Route path="/connexion" element={<Connexion />} />
          
          {/* Page Inscription */}
          <Route path="/inscription" element={<Inscription />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
