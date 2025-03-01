const express = require('express')
const router = express.Router()
const climateController = require('../controllers/climate.controller')
const climateValidator = require('../validations/climate.validation')

router.post('/', climateValidator.createClimate, climateController.createClimate)
router.get('/', climateValidator.getClimates, climateController.getClimates)
router.get('/:id', climateValidator.getClimate, climateController.getClimate)
router.put('/:id', climateValidator.updateClimate, climateController.updateClimate)
router.delete('/:id', climateValidator.deleteClimate, climateController.deleteClimate)

module.exports = router
