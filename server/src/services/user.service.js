const bcryptjs = require('bcryptjs')
const User = require('../models/user.model')
const Branch = require('../models/branch.model')
const { generateVerificationToken } = require('../helpers/common.helper')
const { generateToken } = require('../helpers/jwt.helper')
const { sendVerificationMail, sendWelcomeMail } = require('../helpers/mail/emails.helper')

async function createUser(data, res) {
  const { name, surname, username, password, email, branchId, role } = data

  if (await User.findOne({ email })) {
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
    branchId,
    role,
    verificationToken,
    verificationTokenExpiresAt
  })
  if (role === 'super') {
    newUser.isVerified = true
  }

  await newUser.save()
  generateToken(newUser.id)

  if (branchId) {
    await Branch.findOneAndUpdate(
      { id: branchId },
      { $addToSet: { userIds: newUser.id } }
    )
  }

  if (role !== 'super') {
    try {
      await sendVerificationMail(email, verificationToken)
    } catch (err) {
      console.error('Error sending verification email:', err)
      throw err
    }
  }

  const userObj = newUser.toObject()
  delete userObj.password
  delete userObj._id
  delete userObj.__v
  return userObj
}

async function getUsers() {
  return await User.find()
}

async function getUser(id) {
  const user = await User.findOne({ id })
  if (!user) {
    throw new Error('Kullanıcı bulunamadı.')
  }
  return user
}

async function updateUser(id, data) {
  const existing = await User.findOne({ id })
  if (!existing) {
    throw new Error('Kullanıcı bulunamadı.')
  }

  const oldBranchId = existing.branchId
  const newBranchId = data.branchId

  const updatedUser = await User.findOneAndUpdate({ id }, data, { new: true })
  if (!updatedUser) {
    throw new Error('Kullanıcı güncellenirken bir hata oluştu.')
  }

  if (oldBranchId && oldBranchId !== newBranchId) {
    await Branch.findOneAndUpdate(
      { id: oldBranchId },
      { $pull: { userIds: id } }
    )
  }

  if (newBranchId && newBranchId !== oldBranchId) {
    await Branch.findOneAndUpdate(
      { id: newBranchId },
      { $addToSet: { userIds: id } }
    )
  }

  return updatedUser
}

async function deleteUser(id) {
  const user = await User.findOne({ id })
  if (!user) {
    throw new Error('Kullanıcı bulunamadı.')
  }

  const branchId = user.branchId
  await User.deleteOne({ id })

  if (branchId) {
    await Branch.findOneAndUpdate(
      { id: branchId },
      { $pull: { userIds: id } }
    )
  }

  return true
}

async function verifyEmail(code) {
  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiresAt: { $gt: Date.now() }
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
  verifyEmail
}
