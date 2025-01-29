const { validateIdInParams } = require('../helpers/common.helper')

const createDevice = async (req, res, next) => {
  let errors = []
  const { name, description, chipId, min, max, tolerance, measurementType, modelName, color } = req.body

  if (!name) {
    errors.push({
      error: `'name' field is required to create a device.`,
    })
  }
  if (!description) {
    errors.push({
      error: `'description' field is required to create a device.`,
    })
  }
  if (!chipId) {
    errors.push({
      error: `'chipId' field is required to create a device.`,
    })
  }
  if (min === undefined) {
    errors.push({
      error: `'min' field is required to create a device.`,
    })
  }
  if (!max) {
    errors.push({
      error: `'max' field is required to create a device.`,
    })
  }
  if (!tolerance) {
    errors.push({
      error: `'tolerance' field is required to create a device.`,
    })
  }
  if (!['temperature', 'humidity', 'current'].includes(measurementType)) {
    errors.push({
      error: `'measurementType' field should be one of ['temperature', 'humidity', 'current'].`,
    })
  }
  if (!['DT-100', 'DT-200', 'DT-300'].includes(modelName)) {
    errors.push({
      error: `'modelName' field should be one of ['DT-100', 'DT-200', 'DT-300'].`,
    })
  }
  if (!color) {
    errors.push({
      error: `'color' field is required to create a device.`,
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
    const { name, description, chipId, min, max, tolerance, measurementType, modelName, color } = req.body

    if (!name || name === undefined) {
      errors.push({
        error: `'name' field is required to update a device.`,
      })
    }
    if (!description || description === undefined) {
      errors.push({
        error: `'description' field is required to update a device.`,
      })
    }
    if (!chipId || chipId === undefined) {
      errors.push({
        error: `'chipId' field is required to update a device.`,
      })
    }
    if (!min || min === undefined) {
      errors.push({
        error: `'min' field is required to update a device.`,
      })
    }
    if (!max || max === undefined) {
      errors.push({
        error: `'max' field is required to update a device.`,
      })
    }
    if (!tolerance || tolerance === undefined) {
      errors.push({
        error: `'tolerance' field is required to update a device.`,
      })
    }
    if (!['temperature', 'humidity', 'current'].includes(measurementType)) {
      errors.push({
        error: `'measurementType' field should be one of ['temperature', 'humidity', 'current'].`,
      })
    }
    if (!['DT-100', 'DT-200', 'DT-300'].includes(modelName)) {
      errors.push({
        error: `'modelName' field should be one of ['DT-100', 'DT-200', 'DT-300'].`,
      })
    }
    if (!color || color === undefined) {
      errors.push({
        error: `'color' field is required to update a device.`,
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
