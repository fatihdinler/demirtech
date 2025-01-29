const express = require('express')
const router = express.Router()
const deviceController = require('../controllers/device.controller')
const deviceValidator = require('../validations/device.validation')

router.post('/', deviceValidator.createDevice, deviceController.createDevice)
router.get('/', deviceValidator.getDevices, deviceController.getDevices)
router.get('/:id', deviceValidator.getDevice, deviceController.getDevice)
router.put('/:id', deviceValidator.updateDevice, deviceController.updateDevice)
router.delete('/:id', deviceValidator.deleteDevice, deviceController.deleteDevice)

module.exports = router
