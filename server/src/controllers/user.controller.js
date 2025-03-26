const asyncHandler = require('express-async-handler')
const userService = require('../services/user.service')
const httpStatus = require('http-status-codes')

const createUser = asyncHandler(async (req, res) => {
  const { username } = req.body
  const otp = await userService.createUserService(username)
  res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu', otp })
})

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUser(req.params.id)
  if (!user) {
    global.logger.error(`User not found: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'User not found',
    })
  }
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'User retrieved successfully',
    data: user,
  })
})

module.exports = {
  createUser,
  getUser,
}
