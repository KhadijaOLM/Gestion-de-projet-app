
//backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

  const protect = async (req, res, next) => {
 // 1. Vérifier la présence du token
 const authHeader = req.headers.authorization;
 if (!authHeader || !authHeader.startsWith('Bearer ')) {
   return res.status(401).json({ message: 'Token non fourni' });
 }

 const token = authHeader.split(' ')[1];
 
 try {
   // 2. Vérifier le token
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
   // 3. Trouver l'utilisateur
   req.user = await User.findById(decoded.id).select('-password');
   
   if (!req.user) {
     return res.status(401).json({ message: 'Utilisateur non trouvé' });
   }
   
   next();
 } catch (error) {
   console.error('Erreur JWT:', error);
   return res.status(401).json({ 
     message: 'Token invalide',
     error: error.message 
   });
 }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };
