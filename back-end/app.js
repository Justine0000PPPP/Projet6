require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routs/user');
const bookRoutes = require('./routs/book');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(error => console.error('Connexion à MongoDB échouée :', error));

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;