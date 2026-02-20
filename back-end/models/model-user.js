const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // pour garantir l'unicité des emails

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'L’email est requis'], 
    unique: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Format d’email invalide'] 
  },
  password: { 
    type: String, 
    required: [true, 'Le mot de passe est requis'] 
  }
});

// Plugin pour signaler les erreurs d'unicité
userSchema.plugin(uniqueValidator, { message: 'Email déjà utilisé.' });

module.exports = mongoose.model('User', userSchema);