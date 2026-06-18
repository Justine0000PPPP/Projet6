const express = require('express');
const router = express.Router();

const bookCtrl = require('../controleur/controleur-book');
const auth = require('../midd/auth');
const multer = require('../midd/multer-config');

// Lecture
router.get('/', bookCtrl.getAllBooks);

// Route des meilleurs livres
router.get('/bestrating', bookCtrl.getBestRatedBooks);

router.get('/:id', bookCtrl.getBookById);

// Création d'un livre
router.post('/', auth, multer, bookCtrl.createBook);

// Modification d'un livre
router.put('/:id', auth, multer, bookCtrl.updateBook);

// Suppression d'un livre
router.delete('/:id', auth, bookCtrl.deleteBook);

// Ajout d'une note
router.post('/:id/rating', auth, bookCtrl.addRating);

module.exports = router;