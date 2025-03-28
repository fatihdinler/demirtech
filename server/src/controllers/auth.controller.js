const asyncHandler = require('express-async-handler')
const authService = require('../services/auth.service')

const deprecatedLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body
  const token = await authService.loginService(username, password)

  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600 * 1000,
  })

  res.status(200).json({ token })
})

const deprecatedChangePassword = asyncHandler(async (req, res) => {
  const { username, otp, newPassword } = req.body
  await authService.changePasswordService(username, otp, newPassword)
  res.status(200).json({ message: 'Şifre başarıyla değiştirildi' })
})

const deprecatedLogout = asyncHandler(async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]
  await authService.logoutService(token)
  res.clearCookie('accessToken')
  res.status(200).json({ message: 'Başarıyla çıkış yapıldı' })
})

module.exports = {
  deprecatedLogin,
  deprecatedChangePassword,
  deprecatedLogout,
}
