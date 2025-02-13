import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;  // Nouvelle syntaxe avec Vite
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
