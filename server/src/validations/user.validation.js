const { validateIdInParams } = require('../helpers/common.helper')

const validateCreateUser = (req, res, next) => {
  const { name, surname, username, password, email, branchId, role } = req.body
  let errors = []

  if (!name) {
    errors.push({ error: `'name' field is required to create a user.` })
  }

  if (!surname) {
    errors.push({ error: `'surname' field is required to create a user.` })
  }

  if (!username) {
    errors.push({ error: `'username' field is required to create a user.` })
  }

  if (!password) {
    errors.push({ error: `'password' field is required to create a user.` })
  }

  if (!email) {
    errors.push({ error: `'email' field is required to create a user.` })
  }

  if (!branchId) {
    errors.push({ error: `'branchId' field is required to create a user.` })
  }

  if (!role) {
    errors.push({ error: `'role' field is required to create a user.` })
  } else if (!['super', 'client'].includes(role)) {
    errors.push({ error: `'role' field should be one of [super, client]` })
  }

  if (errors.length) {
    return res.status(400).json({
      message: 'VALIDATION_FAILED',
      errors,
    })
  }
  next()
}

const updateUser = (req, res, next) => {
  const { name, surname, username, password, email, branchId, role } = req.body
  let errors = []

  if (!name || name === undefined) {
    errors.push({ error: `'name' field is required to update a user.` })
  }

  if (!surname || surname === undefined) {
    errors.push({ error: `'surname' field is required to update a user.` })
  }

  if (!username || username === undefined) {
    errors.push({ error: `'username' field is required to update a user.` })
  }

  if (!password || password === undefined) {
    errors.push({ error: `'password' field is required to update a user.` })
  }

  if (!email || email === undefined) {
    errors.push({ error: `'email' field is required to update a user.` })
  }

  if (!branchId || branchId === undefined) {
    errors.push({ error: `'branchId' field is required to update a user.` })
  }

  if (!role || role === undefined) {
    errors.push({ error: `'role' field is required to update a user.` })
  } else if (!['super', 'client'].includes(role)) {
    errors.push({ error: `'role' field should be one of [super, client]` })
  }

  if (errors.length) {
    return res.status(400).json({
      message: 'VALIDATION_FAILED',
      errors,
    })
  }
  next()
}

const deleteUser = (req, res, next) => {
  validateIdInParams(req, res, next)
}

const getUser = (req, res, next) => {
  validateIdInParams(req, res, next)
}

module.exports = {
  validateCreateUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers: async (req, res, next) => next(),
}
