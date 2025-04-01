const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const userValidations = require('../validations/user.validation')

router.get('/:id', userValidations.getUser, userController.getUser)
router.get('/', userValidations.getUsers, userController.getUsers)
router.put('/:id', userValidations.updateUser, userController.updateUser)
router.delete('/:id', userValidations.deleteUser, userController.deleteUser)

router.post('/', userValidations.validateCreateUser, userController.createUser)
router.post('/verify-email', userValidations.verifyEmail, userController.verifyEmail)

module.exports = router
