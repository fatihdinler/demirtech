// src/helpers/jwt.helper.js
const jwt = require('jsonwebtoken');
const config = require('../config');

function generateToken(userId) {
  return jwt.sign({ userId }, config.DEMIRTECH_JWT_SECRET, {
    expiresIn: '1d',
  });
}

module.exports = { generateToken };
