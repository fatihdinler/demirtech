const jwt = require('jsonwebtoken')
const config = require('../config')

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization // "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token missing' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, config.DEMIRTECH_JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

module.exports = verifyToken
