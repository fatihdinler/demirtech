const bcryptjs = require('bcryptjs')
const User = require('../models/user.model')
const { generateVerificationToken } = require('../helpers/common.helper')
const { generateTokenAndSetCookie } = require('../helpers/jwt.helper')
const { sendVerificationMail, sendWelcomeMail } = require('../helpers/mail/emails.helper')

const createUser = async (data, res) => {
  const { name, surname, username, password, email, branchId, role } = data

  const userAlreadyExists = await User.findOne({ email })
  if (userAlreadyExists) {
    throw new Error('Kullanıcı zaten mevcut.')
  }

  const hashedPassword = await bcryptjs.hash(password, 10)

  const verificationToken = generateVerificationToken()
  const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000

  const newUser = new User({
    name,
    surname,
    username,
    password: hashedPassword,
    email,
    verificationToken,
    verificationTokenExpiresAt,
    branchId,
    role,
  })

  if (role === 'super') {
    newUser.isVerified = true
  }

  await newUser.save()

  generateTokenAndSetCookie(res, newUser.id)

  if (role !== 'super') {
    try {
      await sendVerificationMail(newUser.email, verificationToken)
    } catch (error) {
      console.error("Error sending verification email:", error)
      throw new Error(error)
    }
  }

  const userObj = newUser.toObject()
  delete userObj.password
  delete userObj._id
  delete userObj.__v

  return userObj
}

const getUsers = async () => {
  return await User.find()
}

const getUser = async (id) => {
  const user = await User.findOne({ id: id })
  if (!user) {
    throw new Error('Kullanıcı bulunamadı.')
  }
  return user
}

const updateUser = async (id, data) => {
  const updatedUser = await User.findOneAndUpdate({ id: id }, data, { new: true })
  if (!updatedUser) {
    throw new Error('Kullanıcı güncellenirken bir hata oluştu.')
  }
  return updatedUser
}

const deleteUser = async (id) => {
  const result = await User.deleteOne({ id: id })
  if (result.deletedCount === 0) {
    throw new Error('Kullanıcı silinirken bir hata oluştu.')
  }
  return true
}

const verifyEmail = async (code) => {
  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiresAt: { $gt: Date.now() },
  })
  if (!user) {
    throw new Error('Geçersiz veya süresi dolmuş doğrulama kodu.')
  }

  user.isVerified = true
  user.verificationToken = undefined
  user.verificationTokenExpiresAt = undefined

  await sendWelcomeMail(user.email, user.name)
  await user.save()

  const userObj = user.toObject()
  delete userObj.password
  delete userObj._id
  delete userObj.__v

  return userObj
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  verifyEmail,
}
