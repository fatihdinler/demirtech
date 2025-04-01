const jwt = require('jsonwebtoken')
const config = require('../config')

const verifyToken = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: 'Unauthorized request, no token provided. Please login first!',
      })
  }

  try {
    const decodedToken = jwt.verify(token, config.DEMIRTECH_JWT_SECRET)
    if (!decodedToken) {
      return res
        .status(401)
        .json({
          success: false,
          message: 'Unauthorized request, invalid token detected. Please re-login!',
        })
    }

    req.userId = decodedToken.userId
    next()
  } catch (error) {
    console.log('>>> ERROR IN MIDDLEWARE: VERIFYTOKEN(): ', error)
    return res
      .status(500)
      .json({
        success: false,
        message: 'Server Error',
      })
  }
}

module.exports = verifyToken