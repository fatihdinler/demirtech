const bcryptjs = require('bcryptjs')
const { v4: uuid } = require('uuid')
const config = require('../config')
const userModel = require('../models/user.model')
const { generateToken } = require('../helpers/jwt.helper')
const { sendPasswordResetEmail, sendResetSuccessEmail } = require('../helpers/mail/emails.helper')

const login = async (credentials, res) => {
  const { email, password } = credentials
  const user = await userModel.findOne({ email })
  if (!user) {
    throw new Error('Invalid credentials - kullanıcı bulunamadı')
  }
  const isPasswordValid = await bcryptjs.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Error('Invalid credentials - şifre hatalı')
  }

  const token = generateToken(user.id)

  user.lastLogin = new Date()
  await user.save()

  const userObj = user.toObject()
  delete userObj.__v
  delete userObj._id
  delete userObj.password
  return { user: userObj, token }
}

const forgotPassword = async (email) => {
  const user = await userModel.findOne({ email })
  if (!user) {
    throw new Error('User Not Found')
  }
  const resetToken = uuid()
  const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000

  user.resetPasswordToken = resetToken
  user.resetPasswordExpiresAt = resetTokenExpiresAt
  await user.save()

  await sendPasswordResetEmail(user.email, `${config.DEMIRTECH_CLIENT_URL}/reset-password/${resetToken}`)
  return { message: 'Password reset link sent to your email' }
}

const resetPassword = async (token, newPassword) => {
  const user = await userModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpiresAt: { $gt: Date.now() },
  })
  if (!user) {
    throw new Error('Invalid or expired reset token.')
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10)
  user.password = hashedPassword
  user.resetPasswordToken = undefined
  user.resetPasswordExpiresAt = undefined
  await user.save()

  await sendResetSuccessEmail(user.email)

  const userObj = user.toObject()
  delete userObj.__v
  delete userObj._id
  delete userObj.password
  return userObj
}

const checkAuth = async (userId) => {
  const user = await userModel.findOne({ id: userId }).lean()
  if (!user) {
    throw new Error('User Not Found')
  }
  return user
}

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  checkAuth,
}
