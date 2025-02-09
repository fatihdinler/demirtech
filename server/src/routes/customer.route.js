const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customer.controller')
const customerValidator = require('../validations/customer.validation')

router.post('/', customerValidator.createCustomer, customerController.createCustomer)
router.get('/', customerValidator.getCustomers, customerController.getCustomers)
router.get('/:id', customerValidator.getCustomer, customerController.getCustomer)
router.put('/:id', customerValidator.updateCustomer, customerController.updateCustomer)
router.delete('/:id', customerValidator.deleteCustomer, customerController.deleteCustomer)

module.exports = router
