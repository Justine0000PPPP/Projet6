const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const auth = require('../middleware/auth'); // middleware à créer pour vérifier le token

// Créer un livre
router.post('/', auth, async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      userId: req.userId // défini dans le middleware auth
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Lire tous les livres
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Mettre à jour un livre
router.put('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book.userId !== req.userId) {
      return res.status(403).json({ message: 'unauthorized request' });
    }

    Object.assign(book, req.body);
    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Supprimer un livre
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book.userId !== req.userId) {
      return res.status(403).json({ message: 'unauthorized request' });
    }

    await Book.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Livre supprimé !' });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;