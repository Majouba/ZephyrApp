import express from 'express';
import bcrypt from 'bcrypt';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import preferencesRoutes from './src/routes/preferencesRoutes.js';

dotenv.config(); // Charger les variables d'environnement

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key';

app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ZephyrApp API Documentation',
      version: '1.0.0',
      description: 'API pour la gestion des utilisateurs : inscription, connexion, mise à jour et accès protégé.',
    },
    servers: [{ url: `http://localhost:${port}` }],
  },
  apis: ['./server.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connexion à la base de données
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
    console.log('✅ Connecté à la base de données');
  }
});

// Middleware pour vérifier le token JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ error: 'Token requis' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Route de test.
 *     description: Vérifie si l'API est accessible.
 *     responses:
 *       200:
 *         description: API test accessible.
 */
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API test accessible' });
});

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inscription réussie.
 *       400:
 *         description: Tous les champs sont requis ou email déjà utilisé.
 *       500:
 *         description: Erreur interne du serveur.
 */
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
        res.status(201).json({ message: 'Inscription réussie' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Connexion de l'utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token JWT.
 *       400:
 *         description: Email ou mot de passe incorrect.
 *       500:
 *         description: Erreur interne du serveur.
 */
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

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: 'Connexion réussie',
        token,
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

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Met à jour les informations d'un utilisateur.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Informations mises à jour avec succès.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  db.query(query, [name, email, id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la mise à jour des informations :', err);
      return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({ message: 'Informations mises à jour avec succès !' });
  });
});

// Utilisation des routes preferences
app.use('/api/preferences', preferencesRoutes);

app.listen(port, () => {
  console.log(`🚀 Serveur en écoute sur http://localhost:${port}`);
  console.log(`📄 Documentation Swagger disponible sur http://localhost:${port}/api-docs`);
});
