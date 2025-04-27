const express = require('express')
const router = express.Router()
const deviceController = require('../controllers/device.controller')
const deviceValidator = require('../validations/device.validation')
const verifyToken = require('../middlewares/auth.middleware')

router.get('/get-devices-by-user-id', verifyToken, deviceValidator.getDevicesByUserId, deviceController.getDevicesByUserId)

router.post('/', verifyToken, deviceValidator.createDevice, deviceController.createDevice)
router.get('/', verifyToken, deviceValidator.getDevices, deviceController.getDevices)
router.get('/:id', verifyToken, deviceValidator.getDevice, deviceController.getDevice)
router.put('/:id', verifyToken, deviceValidator.updateDevice, deviceController.updateDevice)
router.delete('/:id', verifyToken, deviceValidator.deleteDevice, deviceController.deleteDevice)

module.exports = router
