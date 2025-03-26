const { validateIdInParams } = require('../helpers/common.helper')

const validateCreateUser = (req, res, next) => {
  const { username } = req.body
  let errors = []
  if (!username) {
    errors.push({ error: `'username' field is required to create a user.` })
  }
  if (errors.length) {
    return res.status(400).json({
      message: 'VALIDATION_FAILED',
      errors,
    })
  }
  next()
}

const getUser = (req, res, next) => {
  validateIdInParams(req, res, next)
}

module.exports = {
  validateCreateUser,
  getUser,
}
