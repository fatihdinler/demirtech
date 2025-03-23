const jwt = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
const User = require('../models/user.model')
const Token = require('../models/token.model')
const OTP = require('../models/otp.model')

const loginService = async (username, password) => {
  const user = await User.findOne({ username })
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Geçersiz kimlik bilgileri')
  }
  // Eğer kullanıcı henüz kalıcı şifre belirlememişse
  if (user.isTempPassword || !user.password) {
    throw new Error('Lütfen şifrenizi değiştirin')
  }

  // Eğer aktif bir token varsa (yani kullanıcı zaten login olmuşsa) hata fırlatıyoruz
  const activeToken = await Token.findOne({ userId: user.id, expiresAt: { $gt: new Date() } })
  if (activeToken) {
    throw new Error('Kullanıcı zaten giriş yapmış.')
  }

  // 1 saat geçerli token oluşturuluyor
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

  // Oluşturulan token'ı database'e kaydediyoruz
  await Token.create({
    id: uuid(),
    userId: user.id,
    token,
    expiresAt: new Date(Date.now() + 3600 * 1000)
  })

  return token
}

const changePasswordService = async (username, otp, newPassword) => {
  const user = await User.findOne({ username })
  if (!user) {
    throw new Error('Kullanıcı bulunamadı')
  }
  // OTP kaydı ilgili kullanıcıya ait kontrol ediliyor
  const otpRecord = await OTP.findOne({ userId: user.id, otp })
  if (!otpRecord) {
    throw new Error('Geçersiz OTP')
  }
  if (otpRecord.expiresAt < new Date()) {
    throw new Error('OTP süresi dolmuş')
  }
  // Yeni şifre ataması ve kullanıcı güncellemesi
  user.password = newPassword
  user.isTempPassword = false
  await user.save()
  // OTP kaydı siliniyor
  await OTP.deleteOne({ id: otpRecord.id })
}

const logoutService = async (token) => {
  if (token) {
    await Token.deleteOne({ token })
  }
}

module.exports = { loginService, changePasswordService, logoutService }
