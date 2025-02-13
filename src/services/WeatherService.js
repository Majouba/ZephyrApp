import axios from 'axios';

// Accéder à la clé API depuis le fichier .env
const API_KEY = process.env.REACT_APP_API_KEY;  // Utilisez process.env pour accéder à votre variable
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const WeatherService = {
  async getWeatherByCity(city) {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'fr',
      },
    });
    return response.data;
  }
};

export default WeatherService;
