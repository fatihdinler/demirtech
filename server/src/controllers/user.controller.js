const asyncHandler = require('express-async-handler')
const userService = require('../services/user.service')

const createUser = asyncHandler(async (req, res) => {
  const { username } = req.body
  const otp = await userService.createUserService(username)
  res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu', otp })
})

module.exports = { createUser }
