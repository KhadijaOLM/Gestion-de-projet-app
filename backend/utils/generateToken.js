const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generate JWT token for authentication
 * @param {string} userId - User ID to include in token payload
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;