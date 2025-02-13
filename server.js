import express from 'express';
import bcrypt from 'bcrypt';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken'; // Importation de jsonwebtoken

const app = express();
const port = 5000;
const JWT_SECRET = 'ton_super_secret_jwt'; // Clé secrète pour signer les tokens

app.use(cors());
app.use(express.json());

// Connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // À ajuster si nécessaire
  database: 'ZephyrApp',
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données :', err);
  } else {
    console.log('✅ Connecté à la base de données');
  }
});

// Route de test
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API test accessible' });
});

// API d'inscription
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).json({ error: 'Erreur interne du serveur' });

      if (result.length > 0) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

      db.query(query, [username, email, hashedPassword], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur lors de l\'inscription' });
        }
        res.status(200).json({ message: 'Inscription réussie' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// API de connexion
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Erreur interne du serveur' });

      if (results.length === 0) {
        return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
      }

      // ✅ Génération du token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name }, // Payload
        JWT_SECRET, // Clé secrète
        { expiresIn: '1h' } // Durée de validité
      );

      res.status(200).json({
        message: 'Connexion réussie',
        token: token,  // Le token est retourné ici
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Serveur en écoute sur http://localhost:${port}`);
});
