const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const { validateLogin, validateChangePassword } = require('../validations/auth.validation')

router.post('/login', validateLogin, authController.deprecatedLogin)
router.post('/change-password', validateChangePassword, authController.deprecatedChangePassword)
router.post('/logout', authController.deprecatedLogout)

module.exports = router
