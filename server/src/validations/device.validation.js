const { validateIdInParams } = require('../helpers/common.helper')
const { deviceTypes, deviceMeasurementTypes } = require('../../constants')

const createDevice = async (req, res, next) => {
  let errors = []
  const { name, chipId, deviceType, measurementType, locationId } = req.body

  if (!name) {
    errors.push({
      error: `'name' field is required to create a device.`,
    })
  }
  if (!locationId) {
    errors.push({
      error: `'locationId' field is required to create a device.`,
    })
  }
  if (!chipId) {
    errors.push({
      error: `'chipId' field is required to create a device.`,
    })
  } else if (!/^\d+$/.test(chipId)) {
    errors.push({
      error: `'chipId' field must be a numeric value.`,
    })
  }
  if (!deviceTypes.includes(deviceType)) {
    errors.push({
      error: `'deviceType' field should be one of ${deviceTypes.map(type => type)}`,
    })
  }
  if (!deviceMeasurementTypes.includes(measurementType)) {
    errors.push({
      error: `'measurementType' field should be one of ${deviceMeasurementTypes.map(type => type)}`,
    })
  }

  if (errors.length) {
    return res.status(404).send({
      message: 'VALIDATION_FAILED',
      errors: errors,
    })
  } else {
    next()
  }
}

const getDevice = (req, res, next) => {
  validateIdInParams(req, res, next)
}

const updateDevice = (req, res, next) => {
  validateIdInParams(req, res, () => {
    let errors = []
    const { name, chipId, locationId, deviceType, measurementType } = req.body

    if (!name || name === undefined) {
      errors.push({
        error: `'name' field is required to create a device.`,
      })
    }
    if (!locationId || locationId === undefined) {
      errors.push({
        error: `'locationId' field is required to create a device.`,
      })
    }
    if (!chipId || chipId === undefined) {
      errors.push({
        error: `'chipId' field is required to create a device.`,
      })
    } else if (!/^\d+$/.test(chipId)) {
      errors.push({
        error: `'chipId' field must be a numeric value.`,
      })
    }
    if (!deviceTypes.includes(deviceType) || deviceType === undefined) {
      errors.push({
        error: `'deviceType' field should be one of ${deviceTypes.map(type => type)}`,
      })
    }
    if (!deviceMeasurementTypes.includes(measurementType) || measurementType === undefined) {
      errors.push({
        error: `'deviceMeasurementTypes' field should be one of ${deviceMeasurementTypes.map(type => type)}`,
      })
    }

    if (errors.length) {
      return res.status(404).send({
        message: 'VALIDATION_FAILED',
        errors: errors,
      })
    } else {
      next()
    }
  })
}

const deleteDevice = (req, res, next) => {
  validateIdInParams(req, res, next)
}

module.exports = {
  createDevice,
  getDevices: async (req, res, next) => next(),
  getDevice,
  updateDevice,
  deleteDevice,
}
