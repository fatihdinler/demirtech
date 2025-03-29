const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const authValidations = require('../validations/auth.validation')

router.post('/logout', authController.logout)
// router.post('/login', validateLogin, authController.deprecatedLogin)
// router.post('/change-password', validateChangePassword, authController.deprecatedChangePassword)
// router.post('/logout', authController.deprecatedLogout)

module.exports = router
