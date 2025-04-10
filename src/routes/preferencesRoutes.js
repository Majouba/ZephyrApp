import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données :', err);
  } else {
    console.log('✅ Connecté à la base de données (preferencesRoutes)');
  }
});

// GET /api/preferences/:userId => récupérer les seuils + villes
router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  const userQuery = `
    SELECT temperature_threshold, humidity_threshold, wind_threshold
    FROM users
    WHERE id = ?
  `;
  const cityQuery = `
    SELECT city FROM preferences
    WHERE user_id = ?
  `;

  db.query(userQuery, [userId], (err, userResult) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur (utilisateur).' });
    if (userResult.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé.' });

    db.query(cityQuery, [userId], (err, cityResult) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur (villes).' });

      const favorite_cities = cityResult.map(row => row.city);
      res.status(200).json({
        message: 'Préférences récupérées avec succès.',
        preferences: {
          ...userResult[0],
          favorite_cities
        }
      });
    });
  });
});

// POST /api/preferences/update => mise à jour seuils + villes
router.post('/update', (req, res) => {
  const { userId, temperature, humidity, wind, favorite_cities } = req.body;

  if (!userId || temperature == null || humidity == null || wind == null) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  if (temperature < 0 || temperature > 50 || humidity < 0 || humidity > 100 || wind < 0 || wind > 100) {
    return res.status(400).json({ error: 'Valeurs des seuils invalides.' });
  }

  const updateUserQuery = `
    UPDATE users 
    SET temperature_threshold = ?, humidity_threshold = ?, wind_threshold = ?
    WHERE id = ?
  `;

  db.query(updateUserQuery, [temperature, humidity, wind, userId], (err) => {
    if (err) {
      console.error('❌ Erreur lors de la mise à jour des seuils :', err);
      return res.status(500).json({ error: 'Erreur serveur (seuils).' });
    }

    // Supprimer les anciennes villes
    const deleteCitiesQuery = `DELETE FROM preferences WHERE user_id = ?`;
    db.query(deleteCitiesQuery, [userId], (err) => {
      if (err) {
        console.error('❌ Erreur lors de la suppression des anciennes villes :', err);
        return res.status(500).json({ error: 'Erreur serveur (suppression villes).' });
      }

      // S'il n'y a pas de villes à insérer
      if (!Array.isArray(favorite_cities) || favorite_cities.length === 0) {
        return res.status(200).json({ message: 'Préférences mises à jour sans villes.' });
      }

      // Insérer les nouvelles villes
      const insertCitiesQuery = `INSERT INTO preferences (user_id, city) VALUES ?`;
      const values = favorite_cities.map(city => [userId, city]);

      db.query(insertCitiesQuery, [values], (err) => {
        if (err) {
          console.error('❌ Erreur lors de l’insertion des villes :', err);
          return res.status(500).json({ error: 'Erreur serveur (insertion villes).' });
        }

        res.status(200).json({ message: 'Préférences mises à jour avec succès.' });
      });
    });
  });
});

export default router;
