const { validateIdInParams } = require('../helpers/common.helper')

const createBranch = async (req, res, next) => {
  let errors = []
  const { customerId, name, address, contactInfo } = req.body

  if (!customerId) {
    errors.push({
      error: `'customerId' field is required to create a branch.`,
    })
  }
  if (!address) {
    errors.push({
      error: `'address' field is required to create a branch.`,
    })
  }
  if (!contactInfo) {
    errors.push({
      error: `'contactInfo' field is required to create a branch.`,
    })
  }
  if (!name) {
    errors.push({
      error: `'name' field is required to create a branch.`,
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

const getBranch = (req, res, next) => {
  validateIdInParams(req, res, next)
}

const updateBranch = (req, res, next) => {
  validateIdInParams(req, res, () => {
    let errors = []
    const { customerId, name, address, contactInfo } = req.body

    if (!customerId || customerId === undefined) {
      errors.push({
        error: `'customerId' field is required to update a branch.`,
      })
    }
    if (!address || address === undefined) {
      errors.push({
        error: `'address' field is required to update a branch.`,
      })
    }
    if (!contactInfo || contactInfo === undefined) {
      errors.push({
        error: `'contactInfo' field is required to update a branch.`,
      })
    }
    if (!name || name === undefined) {
      errors.push({
        error: `'name' field is required to update a branch.`,
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

const deleteBranch = (req, res, next) => {
  validateIdInParams(req, res, next)
}

module.exports = {
  createBranch,
  getBranches: async (req, res, next) => next(),
  getBranch,
  updateBranch,
  deleteBranch,
}
