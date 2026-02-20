// auth.js - middleware pour protéger les routes
const jwt = require('jsonwebtoken');

// Vérifie le token JWT et ajoute req.userId
module.exports = (req, res, next) => {
  try {
    // Vérifier si l'en-tête Authorization existe
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Requête non authentifiée !' });
    }

    // Récupération du token depuis "Bearer TOKEN"
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Requête non authentifiée !' });
    }

    // Vérification du token avec la clé JWT depuis .env
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;

    // Tout est ok → passer à la route suivante
    next();
  } catch (error) {
    res.status(401).json({ message: 'Requête non authentifiée !', error: error.message });
  }
};