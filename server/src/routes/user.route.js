const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const userValidations = require('../validations/user.validation')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/', authMiddleware('super'), userValidations.validateCreateUser, userController.createUser)
router.get('/:id', userValidations.getUser, userController.getUser)

module.exports = router
