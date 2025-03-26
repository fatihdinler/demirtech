const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const userValidations = require('../validations/user.validation')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/', authMiddleware('super'), userValidations.validateCreateUser, userController.createUser)
router.get('/:id', userValidations.getUser, userController.getUser)
router.get('/', userValidations.getUsers, userController.getUsers)
router.put('/:id', authMiddleware('super'), userValidations.updateUser, userController.updateUser)
router.delete('/:id', userValidations.delete, userController.deleteUser)

module.exports = router
