const validateLogin = (req, res, next) => {
  const { username, password } = req.body
  let errors = []
  if (!username) {
    errors.push({ error: `'username' field is required for login.` })
  }
  if (!password) {
    errors.push({ error: `'password' field is required for login.` })
  }
  if (errors.length) {
    return res.status(400).json({
      message: 'VALIDATION_FAILED',
      errors,
    })
  }
  next()
}

const validateChangePassword = (req, res, next) => {
  const { username, otp, newPassword } = req.body
  let errors = []
  if (!username) {
    errors.push({ error: `'username' field is required to change password.` })
  }
  if (!otp) {
    errors.push({ error: `'otp' field is required to change password.` })
  }
  if (!newPassword) {
    errors.push({ error: `'newPassword' field is required to change password.` })
  }
  if (errors.length) {
    return res.status(400).json({
      message: 'VALIDATION_FAILED',
      errors,
    })
  }
  next()
}

module.exports = { validateLogin, validateChangePassword }
