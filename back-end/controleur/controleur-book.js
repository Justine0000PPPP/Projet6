const Book = require('../models/book');

// CRÉER UN LIVRE
exports.createBook = async (req, res) => {
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
};

// RÉCUPÉRER TOUS LES LIVRES
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// MODIFIER UN LIVRE
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    if (book.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Requête non autorisée' });
    }

    Object.assign(book, req.body);
    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// SUPPRIMER UN LIVRE
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    if (book.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Requête non autorisée' });
    }

    await Book.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Livre supprimé !' });
  } catch (error) {
    res.status(400).json({ error });
  }
};