const { v4: uuidv4 } = require('uuid')
const User = require('../models/user.model')
const OTP = require('../models/otp.model')

const createUserService = async (username) => {
  const newUser = await User.create({
    username,
    role: 'client',
    isTempPassword: true,
  })
  const otpCode = uuidv4().slice(0, 8)
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

const getUsers = async () => {
  return await User.find()
}

const updateUser = async (id, data) => {
  return await User.findOneAndUpdate({ id }, data, { new: true })
}

const deleteUser = async (id) => {
  const result = await User.deleteOne({ id })
  return result.deletedCount > 0
}

module.exports = {
  createUserService,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
}
