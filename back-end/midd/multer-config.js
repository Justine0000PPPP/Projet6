// multer-config.js
const multer = require('multer');
const path = require('path');

// Types MIME acceptés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); // Dossier où seront stockées les images
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_').split('.')[0]; // enlever les espaces et l'extension
    const extension = MIME_TYPES[file.mimetype]; // récupérer l'extension correcte
    callback(null, name + '-' + Date.now() + '.' + extension); // nom unique
  }
});

// Filtrage des fichiers pour accepter uniquement les images
const fileFilter = (req, file, callback) => {
  const isValid = !!MIME_TYPES[file.mimetype];
  const error = isValid ? null : new Error('Type de fichier non accepté');
  callback(error, isValid);
};

// Exporter le middleware pour une seule image
module.exports = multer({ storage: storage, fileFilter: fileFilter }).single('image');