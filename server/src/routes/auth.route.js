const express = require('express')
const router = express.Router()
const { login, changePassword, logout } = require('../controllers/auth.controller')
const { validateLogin, validateChangePassword } = require('../validations/auth.validation')

router.post('/login', validateLogin, login)
router.post('/change-password', validateChangePassword, changePassword)
router.post('/logout', logout)

module.exports = router
