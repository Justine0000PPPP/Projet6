const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');        // pour hacher le mot de passe
const jwt = require('jsonwebtoken');     // pour créer des tokens
const User = require('../models/user');  // ton modèle Mongoose

// Création d'un utilisateur (signup)
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'Utilisateur créé !' });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Connexion utilisateur (login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé !' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect !' });

    // Création du token
    const token = jwt.sign(
      { userId: user._id },
      'RANDOM_SECRET_KEY', // à remplacer par une vraie clé secrète plus tard
      { expiresIn: '24h' }
    );

    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;