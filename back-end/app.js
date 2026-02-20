// Charger les variables d'environnement
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // ajouter en haut avec les autres requires
const userRoutes = require('./routs/user');  // routes utilisateurs
const bookRoutes = require('./routs/book');  // routes livres

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Servir le dossier images pour que le front puisse y accéder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(error => console.error('Connexion à MongoDB échouée :', error));

// Routes de l'API
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;