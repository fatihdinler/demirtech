const asyncHandler = require('express-async-handler')
const userService = require('../services/user.service')
const httpStatus = require('http-status-codes')
const User = require('../models/user.model')
const bcryptjs = require('bcryptjs')
const { generateVerificationToken } = require('../helpers/common.helper')
const { generateTokenAndSetCookie } = require('../helpers/jwt.helper')
const { sendVerificationMail } = require('../helpers/mail/emails.helper')

const createUser = asyncHandler(async (req, res) => {
  const {
    name,
    surname,
    username,
    password,
    email,
    branchId,
    role,
  } = req.body
  try {
    const userAlreadyExists = await User.findOne({ email })
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: 'User is already exists!' })
    }

    const hashedPassword = await bcryptjs.hash(password, 10)
    const verificationToken = generateVerificationToken()

    const user = new User({
      name,
      surname,
      username,
      password: hashedPassword,
      email,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      branchId,
      role,
    })


    console.log(user)
    await user.save()
    generateTokenAndSetCookie(res, user.id)
    await sendVerificationMail(user.email, verificationToken)

    user.toObject()
    delete user.password
    delete user._id
    delete user.__v
    return res.status(201).json({
      success: true,
      message: 'User is created successfully',
      data: user,
    })

  } catch (error) {
    console.log('error -->', error)
  }
})

const getUsers = asyncHandler(async (req, res) => {

})

const updateUser = asyncHandler(async (req, res) => {

})

const deleteUser = asyncHandler(async (req, res) => {

})

const getUser = asyncHandler(async (req, res) => {

})

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
}
