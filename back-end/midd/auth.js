const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Bearer TOKEN
    const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY');
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Requête non authentifiée !' });
  }
};