const { validateIdInParams } = require('../helpers/common.helper')

const createLocation = async (req, res, next) => {
  let errors = []
  const { name, branchId, model } = req.body

  if (!name) {
    errors.push({
      error: `'name' field is required to create a location.`,
    })
  }
  if (!branchId) {
    errors.push({
      error: `'branchId' field is required to create a location.`,
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

const getLocation = (req, res, next) => {
  validateIdInParams(req, res, next)
}

const updateLocation = (req, res, next) => {
  validateIdInParams(req, res, () => {
    let errors = []
    const { name, branchId, model } = req.body

    if (!name || name === undefined) {
      errors.push({
        error: `'name' field is required to update a location.`,
      })
    }
    if (!branchId || branchId === undefined) {
      errors.push({
        error: `'branchId' field is required to update a location.`,
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

const deleteLocation = (req, res, next) => {
  validateIdInParams(req, res, next)
}

module.exports = {
  createLocation,
  getLocations: async (req, res, next) => next(),
  getLocation,
  updateLocation,
  deleteLocation,
}
