const express = require('express');
const router = express.Router();
const auth = require('../midd/auth');
const bookController = require('../controleur/controleur-book');

router.post('/', auth, bookController.createBook);
router.get('/', bookController.getAllBooks);
router.put('/:id', auth, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;