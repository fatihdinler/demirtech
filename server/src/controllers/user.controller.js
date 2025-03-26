const asyncHandler = require('express-async-handler')
const userService = require('../services/user.service')
const httpStatus = require('http-status-codes')

const createUser = asyncHandler(async (req, res) => {
  const { username } = req.body
  const otp = await userService.createUserService(username)
  res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu', otp })
})

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getUsers()
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Users retrieved successfully',
    data: users,
  })
})

const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body)
  if (!updatedUser) {
    global.logger.error(`User not found for update: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'User not found for update',
    })
  }
  global.logger.info(`User updated: ${updatedUser.name} with id: ${updatedUser.id}`)
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'User updated successfully',
    data: updatedUser,
  })
})

const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await userService.deleteUser(req.params.id)
  if (!deletedUser) {
    global.logger.error(`User not found for delete: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'User not found for delete',
    })
  }
  global.logger.info(`User deleted with id: ${req.params.id}`)
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'User deleted successfully',
    data: deletedUser,
  })
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
  updateUser,
  deleteUser,
  getUsers,
}
