const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');  // à créer plus tard
const bookRoutes = require('./routes/book');  // à créer plus tard

const app = express();

app.use(express.json());  // pour parser le JSON des requêtes

// Connexion MongoDB Atlas (remplace <PASSWORD> et <dbname>)
mongoose.connect('mongodb+srv://JustineF:<Pepette2020>@cluster0-pme76.mongodb.net/monvieuxgrimoire?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(error => console.error('Connexion à MongoDB échouée :', error));

// Routes de l’API
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;