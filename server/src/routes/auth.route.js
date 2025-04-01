const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const authValidations = require('../validations/auth.validation')
const verifyToken = require('../middlewares/auth.middleware')

router.get('/check-auth', verifyToken, authController.checkAuth)

router.post('/login', authValidations.login, authController.login)
router.post('/logout', authController.logout)
router.post('/forgot-password', authValidations.forgotPassword, authController.forgotPassword)
router.post('/reset-password/:token', authValidations.resetPassword, authController.resetPassword)

module.exports = router
