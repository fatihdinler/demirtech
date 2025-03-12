const express = require('express')
const router = express.Router()
const locationController = require('../controllers/location.controller')
const locationValidator = require('../validations/location.validation')

router.post('/', locationValidator.createLocation, locationController.createLocation)
router.get('/', locationValidator.getLocations, locationController.getLocations)
router.get('/:id', locationValidator.getLocation, locationController.getLocation)
router.put('/:id', locationValidator.updateLocation, locationController.updateLocation)
router.delete('/:id', locationValidator.deleteLocation, locationController.deleteLocation)

module.exports = router
