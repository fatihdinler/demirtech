// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Token = require('../models/token.model');

const authMiddleware = (allowedRoles = []) => {
  if (typeof allowedRoles === 'string') allowedRoles = [allowedRoles];

  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token bulunamadı' });
    }

    const token = authHeader.split(' ')[1];

    // Önce token'ın database'de var olup olmadığını kontrol ediyoruz
    const tokenRecord = await Token.findOne({ token });
    if (!tokenRecord) {
      return res.status(401).json({ message: 'Token geçersiz veya iptal edilmiş' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token doğrulanamadı' });
      }
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Yetkiniz yok' });
      }
      req.user = decoded;
      next();
    });
  };
};

module.exports = authMiddleware;
