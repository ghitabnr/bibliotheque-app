const jwt = require('jsonwebtoken');

const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'secret_par_defaut_pour_development',
  expiresIn: process.env.JWT_EXPIRE || '30d'
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_CONFIG.secret, { 
    expiresIn: JWT_CONFIG.expiresIn 
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.secret);
  } catch (error) {
    throw new Error('Token invalide');
  }
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_CONFIG
};