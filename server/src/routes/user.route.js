const express = require('express')
const router = express.Router()
const { createUser } = require('../controllers/user.controller')
const { validateCreateUser } = require('../validations/user.validation')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/', authMiddleware('super'), validateCreateUser, createUser)

module.exports = router
