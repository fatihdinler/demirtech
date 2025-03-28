const config = require('../config')
const jwt = require('jsonwebtoken')

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, config.DEMIRTECH_JWT_SECRET, {
    expiresIn: '1d',
  })

  res.cookie('token', token, {
    httpOnly: true, // Prevent from XSS attacks!
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  })
}

module.exports = {
  generateTokenAndSetCookie,
}