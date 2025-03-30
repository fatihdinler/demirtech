const asyncHandler = require('express-async-handler')
const authService = require('../services/auth.service')

const login = asyncHandler(async (req, res) => {
  const userObj = await authService.login(req.body, res)
  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: userObj,
  })
})

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email)
  res.status(200).json({
    success: true,
    message: result.message,
  })
})

const resetPassword = asyncHandler(async (req, res) => {
  const userObj = await authService.resetPassword(req.params.token, req.body.password)
  res.status(200).json({
    success: true,
    message: 'Password reset successful!',
    data: userObj,
  })
})

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ success: true, message: 'Başarıyla Çıkış Yapıldı!' })
})

const checkAuth = asyncHandler(async (req, res) => {
  const user = await authService.checkAuth(req.userId)
  res.status(200).json({
    success: true,
    data: user,
  })
})

module.exports = {
  login,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth,
}
