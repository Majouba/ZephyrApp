import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const WeatherService = {
  async getWeatherByCity(city) {
    if (!API_KEY) {
      console.error('❌ API_KEY manquant. Vérifiez vos variables d\'environnement.');
      throw new Error('API_KEY manquant.');
    }

    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
          lang: 'fr',
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  },

  async getForecastByCity(city) {
    if (!API_KEY) {
      console.error('❌ API_KEY manquant. Vérifiez vos variables d\'environnement.');
      throw new Error('API_KEY manquant.');
    }

    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
          lang: 'fr',
        },
      });

      const forecastList = response.data.list;

      // Obtenir la date de demain au format YYYY-MM-DD
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedTomorrow = tomorrow.toISOString().split('T')[0];

      // Filtrer pour obtenir uniquement la première prévision de demain
      const forecastForTomorrow = forecastList.find(item => item.dt_txt.startsWith(formattedTomorrow));

      return forecastForTomorrow ? [forecastForTomorrow] : [];
    } catch (error) {
      this.handleError(error);
    }
  },

  handleError(error) {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 404:
          console.error('❌ Ville non trouvée.');
          throw new Error('Ville non trouvée. Veuillez vérifier le nom.');
        case 401:
          console.error('❌ Clé d\'API invalide.');
          throw new Error('Clé d\'API invalide. Veuillez vérifier votre configuration.');
        case 500:
          console.error('❌ Erreur serveur.');
          throw new Error('Erreur interne du serveur. Veuillez réessayer plus tard.');
        default:
          console.error('❌ Erreur inattendue :', error.message);
          throw new Error('Une erreur inattendue est survenue.');
      }
    } else {
      console.error('❌ Erreur réseau ou problème de connexion :', error.message);
      throw new Error('Problème de réseau. Vérifiez votre connexion.');
    }
  },
};

export default WeatherService;
