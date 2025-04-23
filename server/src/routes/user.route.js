const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const userValidations = require('../validations/user.validation')
const verifyToken = require('../middlewares/auth.middleware')

router.get('/:id', verifyToken, userValidations.getUser, userController.getUser)
router.get('/', verifyToken, userValidations.getUsers, userController.getUsers)
router.put('/:id', verifyToken, userValidations.updateUser, userController.updateUser)
router.delete('/:id', verifyToken, userValidations.deleteUser, userController.deleteUser)

router.post('/', verifyToken, userValidations.validateCreateUser, userController.createUser)
router.post('/verify-email', verifyToken, userValidations.verifyEmail, userController.verifyEmail)

module.exports = router
