const jwt = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
const User = require('../models/user.model')

const loginService = async (username, password) => {
}

const changePasswordService = async (username, otp, newPassword) => {
}

const logoutService = async (token) => {
}

module.exports = { loginService, changePasswordService, logoutService }
