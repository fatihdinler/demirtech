const { v4: uuidv4 } = require('uuid')
const User = require('../models/user.model')
const OTP = require('../models/otp.model')

const createUserService = async (username) => {
  // Yeni kullanıcı password girilmediği için boş bırakılıyor, isTempPassword true
  const newUser = await User.create({
    username,
    role: 'client',
    isTempPassword: true,
  })
  // 8 karakterlik rastgele OTP üretiliyor
  const otpCode = uuidv4().slice(0, 8)
  // OTP kaydı oluşturuluyor OTP 10 dakika geçerli
  await OTP.create({
    userId: newUser.id,
    otp: otpCode,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  })
  return otpCode
}

const getUser = async (id) => {
  return await User.findOne({ id })
}

module.exports = {
  createUserService,
  getUser,
}
