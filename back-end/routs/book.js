const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const auth = require('../midd/auth'); // middleware auth

// =====================
// Créer un livre (protégé)
// =====================
router.post('/', auth, async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      userId: req.userId
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// =====================
// Lire tous les livres (public)
// =====================
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// =====================
// Modifier un livre (protégé + propriétaire)
// =====================
router.put('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    if (book.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'unauthorized request' });
    }

    Object.assign(book, req.body);
    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// =====================
// Supprimer un livre (protégé + propriétaire)
// =====================
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    if (book.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'unauthorized request' });
    }

    await Book.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Livre supprimé !' });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
