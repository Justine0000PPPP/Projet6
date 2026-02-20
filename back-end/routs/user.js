const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');        // pour hacher le mot de passe
const jwt = require('jsonwebtoken');     // pour créer des tokens
const User = require('../models/model-user');  // modèle Mongoose

// ---------- SIGNUP ----------
// Crée un nouvel utilisateur
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification présence email et password
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Vérifier si email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création utilisateur
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Utilisateur créé !' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- LOGIN ----------
// Connecte un utilisateur existant
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification présence email et password
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Vérifier que l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé !' });

    // Vérifier mot de passe
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect !' });

    // Création token JWT avec clé depuis .env
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;