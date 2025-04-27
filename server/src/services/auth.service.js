// src/services/auth.service.js

const bcryptjs = require('bcryptjs')
const { v4: uuid } = require('uuid')
const config = require('../config')
const userModel = require('../models/user.model')
const { generateToken } = require('../helpers/jwt.helper')
const { sendPasswordResetEmail, sendResetSuccessEmail } = require('../helpers/mail/emails.helper')

async function login({ email, password }) {
  const user = await userModel.findOne({ email })
  if (!user) {
    throw new Error('Invalid credentials – kullanıcı bulunamadı')
  }

  const isPasswordMatched = await bcryptjs.compare(password, user.password)
  if (!isPasswordMatched) {
    throw new Error('Invalid credentials – şifre hatalı')
  }

  const token = generateToken(user.id)

  user.lastLogin = new Date()
  await user.save()

  const userObj = user.toObject()
  delete userObj.password
  delete userObj.__v
  delete userObj._id

  return { user: userObj, token }
}

async function forgotPassword(email) {
  const user = await userModel.findOne({ email })
  if (!user) {
    throw new Error('User Not Found')
  }
  const resetToken = uuid()
  const resetExpires = Date.now() + 1 * 60 * 60 * 1000

  user.resetPasswordToken = resetToken
  user.resetPasswordExpiresAt = resetExpires
  await user.save()

  await sendPasswordResetEmail(
    user.email,
    `${config.DEMIRTECH_CLIENT_URL}/reset-password/${resetToken}`
  )
  return { message: 'Password reset link sent to your email' }
}

/**
 * Şifre sıfırlama
 */
async function resetPassword(token, newPassword) {
  const user = await userModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpiresAt: { $gt: Date.now() }
  })
  if (!user) {
    throw new Error('Invalid or expired reset token.')
  }

  user.password = await bcryptjs.hash(newPassword, 10)
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

/**
 * Token’daki userId hâlâ geçerliyse o user’a ait verileri döner.
 */
async function checkAuth(userId) {
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
