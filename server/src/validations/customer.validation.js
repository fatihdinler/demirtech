const { validateIdInParams } = require('../helpers/common.helper')

const createCustomer = async (req, res, next) => {
  let errors = []
  const { name } = req.body

  if (!name) {
    errors.push({
      error: `'name' field is required to create a device.`,
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

const getCustomer = (req, res, next) => {
  validateIdInParams(req, res, next)
}

const updateCustomer = (req, res, next) => {
  validateIdInParams(req, res, () => {
    let errors = []
    const { name } = req.body

    if (!name || name === undefined) {
      errors.push({
        error: `'name' field is required to update a device.`,
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

const deleteCustomer = (req, res, next) => {
  validateIdInParams(req, res, next)
}

module.exports = {
  createCustomer,
  getCustomers: async (req, res, next) => next(),
  getCustomer,
  updateCustomer,
  deleteCustomer,
}
