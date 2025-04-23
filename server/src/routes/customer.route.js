const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customer.controller')
const customerValidator = require('../validations/customer.validation')
const verifyToken = require('../middlewares/auth.middleware')

router.post('/', verifyToken, customerValidator.createCustomer, customerController.createCustomer)
router.get('/', verifyToken, customerValidator.getCustomers, customerController.getCustomers)
router.get('/:id', verifyToken, customerValidator.getCustomer, customerController.getCustomer)
router.put('/:id', verifyToken, customerValidator.updateCustomer, customerController.updateCustomer)
router.delete('/:id', verifyToken, customerValidator.deleteCustomer, customerController.deleteCustomer)

module.exports = router
