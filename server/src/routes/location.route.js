const express = require('express')
const router = express.Router()
const locationController = require('../controllers/location.controller')
const locationValidator = require('../validations/location.validation')
const verifyToken = require('../middlewares/auth.middleware')

router.get('/get-locations-by-user-id', verifyToken, locationValidator.getLocations, locationController.getLocationsByUserId)
router.post('/reports', verifyToken, locationController.getLocationReports)

router.post('/', verifyToken, locationValidator.createLocation, locationController.createLocation)
router.get('/', verifyToken, locationValidator.getLocations, locationController.getLocations)
router.get('/:id', verifyToken, locationValidator.getLocation, locationController.getLocation)
router.put('/:id', verifyToken, locationValidator.updateLocation, locationController.updateLocation)
router.delete('/:id', verifyToken, locationValidator.deleteLocation, locationController.deleteLocation)

module.exports = router
