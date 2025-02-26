const { validateIdInParams } = require('../helpers/common.helper')

const createClimate = async (req, res, next) => {
  let errors = []
  const { name, branchId, model } = req.body

  if (!name) {
    errors.push({
      error: `'name' field is required to create a climate.`,
    })
  }
  if (!branchId) {
    errors.push({
      error: `'branchId' field is required to create a climate.`,
    })
  }
  if (!model) {
    errors.push({
      error: `'model' field is required to create a climate.`,
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

const getClimate = (req, res, next) => {
  validateIdInParams(req, res, next)
}

const updateClimate = (req, res, next) => {
  validateIdInParams(req, res, () => {
    let errors = []
    const { name, branchId, model } = req.body

    if (!name || name === undefined) {
      errors.push({
        error: `'name' field is required to update a climate.`,
      })
    }
    if (!branchId || branchId === undefined) {
      errors.push({
        error: `'branchId' field is required to update a climate.`,
      })
    }
    if (!model || model === undefined) {
      errors.push({
        error: `'model' field is required to update a climate.`,
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

const deleteClimate = (req, res, next) => {
  validateIdInParams(req, res, next)
}

module.exports = {
  createClimate,
  getClimates: async (req, res, next) => next(),
  getClimate,
  updateClimate,
  deleteClimate,
}
