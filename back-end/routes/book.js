const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/controleur-book');

router.get('/', bookCtrl.getAllBooks);
// router.get('/bestrating', bookCtrl.getBestRatedBooks);
router.get('/:id', bookCtrl.getBookById);

router.post('/', bookCtrl.createBook);
router.put('/:id', bookCtrl.updateBook);

router.delete('/:id', bookCtrl.deleteBook);

router.post('/:id/rating', bookCtrl.addRating);

module.exports = router;