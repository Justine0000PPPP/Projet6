const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const auth = require('../midd/auth'); // middleware auth
const multer = require('../midd/multer-config'); // Multer pour l'upload
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ---------- Créer un livre (POST /books) ----------
router.post('/', auth, multer, async (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject.userId;

    // Optimiser l'image
    const filename = req.file.filename;
    const filepath = path.join(__dirname, '../images/', filename);
    const optimizedFilename = `optimized-${filename}.webp`;
    const optimizedPath = path.join(__dirname, '../images/', optimizedFilename);

    await sharp(filepath)
      .resize({ width: 500 })
      .webp({ quality: 80 })
      .toFile(optimizedPath);

    // Supprimer l'image originale
    fs.unlinkSync(filepath);

    const book = new Book({
      ...bookObject,
      userId: req.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${optimizedFilename}`,
      ratings: [],
      averageRating: 0
    });

    await book.save();
    res.status(201).json(book);

  } catch (error) {
    res.status(400).json({ error });
  }
});

// ---------- Lire tous les livres (GET /books) ----------
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// ---------- Lire un livre spécifique (GET /books/:id) ----------
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// ---------- Modifier un livre (PUT /books/:id) ----------
router.put('/:id', auth, multer, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    if (book.userId.toString() !== req.userId) return res.status(403).json({ message: 'unauthorized request' });

    // Si une nouvelle image est envoyée
    if (req.file) {
      const filename = req.file.filename;
      const filepath = path.join(__dirname, '../images/', filename);
      const optimizedFilename = `optimized-${filename}.webp`;
      const optimizedPath = path.join(__dirname, '../images/', optimizedFilename);

      await sharp(filepath)
        .resize({ width: 500 })
        .webp({ quality: 80 })
        .toFile(optimizedPath);

      fs.unlinkSync(filepath);

      // Supprimer l'ancienne image
      const oldImage = path.join(__dirname, '../images/', path.basename(book.imageUrl));
      if (fs.existsSync(oldImage)) fs.unlinkSync(oldImage);

      book.imageUrl = `${req.protocol}://${req.get('host')}/images/${optimizedFilename}`;
    }

    const bookObject = req.file ? JSON.parse(req.body.book) : req.body;
    Object.assign(book, bookObject);

    await book.save();
    res.status(200).json(book);

  } catch (error) {
    res.status(400).json({ error });
  }
});

// ---------- Supprimer un livre (DELETE /books/:id) ----------
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    if (book.userId.toString() !== req.userId) return res.status(403).json({ message: 'unauthorized request' });

    const imagePath = path.join(__dirname, '../images/', path.basename(book.imageUrl));
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await Book.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Livre supprimé !' });

  } catch (error) {
    res.status(400).json({ error });
  }
});

// ---------- Ajouter une note (POST /books/:id/rating) ----------
router.post('/:id/rating', auth, async (req, res) => {
  try {
    const bookId = req.params.id;
    const { rating } = req.body;
    const userId = req.userId;

    if (rating < 0 || rating > 5) 
        return res.status(400).json({ message: 'La note doit être entre 0 et 5.' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé.' });

    const alreadyRated = book.ratings.find(r => r.userId === userId);
    if (alreadyRated) return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });

    book.ratings.push({ userId, grade: rating });

    // Mettre à jour averageRating
    const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = total / book.ratings.length;

    await book.save();
    res.status(200).json(book);

  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;