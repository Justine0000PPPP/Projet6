const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: [true, 'Le titre est requis'] 
  },
  author: { 
    type: String, 
    required: [true, 'L’auteur est requis'] 
  },
  imageUrl: { 
    type: String, 
    required: [true, 'L’URL de l’image est requise'] 
  },
  year: { 
    type: Number, 
    required: [true, 'L’année de publication est requise'] 
  },
  genre: { 
    type: String, 
    required: [true, 'Le genre est requis'] 
  },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      grade: { type: Number, required: true, min: 0, max: 5 }
    }
  ],
  averageRating: { 
    type: Number, 
    default: 0 
  }
});

module.exports = mongoose.model('Book', bookSchema);