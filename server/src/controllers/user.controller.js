const asyncHandler = require('express-async-handler')
const httpStatus = require('http-status-codes')
const userService = require('../services/user.service')

const createUser = asyncHandler(async (req, res) => {
  try {
    const createdUser = await userService.createUser(req.body, res)
    return res.status(httpStatus.StatusCodes.CREATED).json({
      status: 'SUCCESS',
      message: 'Kullanıcı başarıyla oluşturuldu.',
      data: createdUser,
    })
  } catch (error) {
    return res.status(httpStatus.StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message || 'Kullanıcı oluşturulurken bir hata oluştu.',
    })
  }
})

const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await userService.getUsers()
    res.status(httpStatus.StatusCodes.OK).json({
      status: 'SUCCESS',
      message: 'Kullanıcılar başarıyla getirildi.',
      data: users,
    })
  } catch (error) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message || 'Kullanıcılar getirilirken bir hata oluştu.',
    })
  }
})

const getUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id
    const user = await userService.getUser(userId)
    res.status(httpStatus.StatusCodes.OK).json({
      status: 'SUCCESS',
      message: 'Kullanıcı başarıyla getirildi.',
      data: user,
    })
  } catch (error) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message || 'Kullanıcı getirilirken bir hata oluştu.',
    })
  }
})

const updateUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id
    const updateData = req.body
    const updatedUser = await userService.updateUser(userId, updateData)
    res.status(httpStatus.StatusCodes.OK).json({
      status: 'SUCCESS',
      message: 'Kullanıcı başarıyla güncellendi.',
      data: updatedUser,
    })
  } catch (error) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message || 'Kullanıcı güncellenirken bir hata oluştu.',
    })
  }
})

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id
    await userService.deleteUser(userId)
    res.status(httpStatus.StatusCodes.OK).json({
      status: 'SUCCESS',
      message: 'Kullanıcı başarıyla silindi.',
    })
  } catch (error) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message || 'Kullanıcı silinirken bir hata oluştu.',
    })
  }
})

const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const { code } = req.body
    const verifiedUser = await userService.verifyEmail(code)
    res.status(httpStatus.StatusCodes.OK).json({
      status: 'SUCCESS',
      message: 'Email doğrulama başarılı.',
      data: verifiedUser,
    })
  } catch (error) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message || 'Email doğrulanırken bir hata oluştu.',
    })
  }
})

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  verifyEmail,
}
