import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';  // Charger les variables d'environnement

dotenv.config();  // Charger les variables du fichier .env

const router = express.Router();

// Connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données dans preferencesRoutes :', err);
  } else {
    console.log('✅ Connecté à la base de données depuis preferencesRoutes');
  }
});

// GET /api/preferences/:userId - Récupérer les seuils de tolérance d'un utilisateur
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT temperature_threshold, humidity_threshold, wind_threshold FROM users WHERE id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des préférences :', err);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({
      message: 'Préférences récupérées avec succès.',
      preferences: results[0],
    });
  });
});

// POST /api/preferences/update - Mettre à jour les seuils de tolérance d'un utilisateur
router.post('/update', (req, res) => {
  const { userId, temperature, humidity, wind } = req.body;

  // Vérification des champs requis
  if (!userId || temperature === undefined || humidity === undefined || wind === undefined) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  // Validation des seuils
  if (temperature < 0 || temperature > 50) {
    return res.status(400).json({ error: 'La température doit être comprise entre 0°C et 50°C.' });
  }
  if (humidity < 0 || humidity > 100) {
    return res.status(400).json({ error: 'Le pourcentage d\'humidité doit être compris entre 0% et 100%.' });
  }
  if (wind < 0 || wind > 100) {
    return res.status(400).json({ error: 'La vitesse du vent doit être comprise entre 0 km/h et 100 km/h.' });
  }

  const query = `
    UPDATE users 
    SET temperature_threshold = ?, humidity_threshold = ?, wind_threshold = ? 
    WHERE id = ?`;

  db.query(query, [temperature, humidity, wind, userId], (err) => {
    if (err) {
      console.error('Erreur lors de la mise à jour des préférences :', err);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
    res.status(200).json({ message: 'Seuils mis à jour avec succès.' });
  });
});

export default router;
