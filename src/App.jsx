import React, { useState } from 'react';
import './App.css';
import WeatherService from './services/WeatherService';
import WeatherCard from './components/WeatherCard/WeatherCard';
import SearchInput from './components/SearchInput/SearchInput';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import NavBar from './components/NavBar/NavBar'; // Importation de NavBar
import MapPage from './pages/MapPage/MapPage';
import Connexion from './pages/Connexion/Connexion';
import Inscription from './pages/Inscription/Inscription';
import MonProfil from './pages/MonProfil/MonProfil';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user } = useAuth();
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    if (!city.trim()) {
      toast.warn('⚠️ Veuillez entrer le nom d\'une ville.');
      setWeather(null);
      return;
    }

    try {
      const data = await WeatherService.getWeatherByCity(city);
      setWeather(data);
      toast.success('🌞 Météo trouvée avec succès !');
    } catch (err) {
      console.error(err);
      setWeather(null);
      toast.error('❌ Erreur lors de la récupération de la météo.');
    }
  };

  return (
    <Router>
      <div className="container">
        <NavBar /> {/* Remplacement du code de navigation par NavBar */}
        
        <Routes>
          <Route
            path="/"
            element={
              <div className="home-page">
                <h1>Météo en direct</h1>
                <div className="search-section">
                  <SearchInput city={city} setCity={setCity} onSearch={fetchWeather} />
                  {user && (
                    <Link to="/map">
                      <button className="map-button">Carte</button>
                    </Link>
                  )}
                </div>
                {weather && <WeatherCard weather={weather} />}
              </div>
            }
          />
          <Route path="/map" element={user ? <MapPage /> : <Navigate to="/connexion" />} />
          <Route path="/connexion" element={user ? <Navigate to="/mon-profil" /> : <Connexion />} />
          <Route path="/inscription" element={user ? <Navigate to="/mon-profil" /> : <Inscription />} />
          <Route path="/mon-profil" element={user ? <MonProfil /> : <Navigate to="/connexion" />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
      </div>
    </Router>
  );
}

export default App;
