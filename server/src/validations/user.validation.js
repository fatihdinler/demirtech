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

module.exports = { validateCreateUser }
