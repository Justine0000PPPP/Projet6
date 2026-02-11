const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // Pour garantir l'unicité de l'email

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Applique le plugin pour gérer les erreurs d'unicité
userSchema.plugin(uniqueValidator); 

module.exports = mongoose.model('User', userSchema);