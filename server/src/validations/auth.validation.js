const login = (req, res, next) => {
  const { email, password } = req.body
  let errors = []

  if (!email) {
    errors.push({ error: `'email' field is required for login.` })
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

const forgotPassword = (req, res, next) => {
  const { email } = req.body
  let errors = []

  if (!email) {
    errors.push({ error: `'email' field is required for change password.` })
  }
  if (errors.length) {
    return res.status(400).json({
      message: 'VALIDATION_FAILED',
      errors,
    })
  }
  next()
}

const resetPassword = (req, res, next) => {
  const { token } = req.params
  const { password } = req.body
  let errors = []

  if (!token) {
    errors.push({ error: `'token' field is required for reset password in req.params` })
  }

  if (!password) {
    errors.push({ error: `'password' field is required for reset password in req.body` })
  }

  if (errors.length) {
    return res.status(400).json({
      message: 'VALIDATION_FAILED',
      errors,
    })
  }
  next()
}

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

module.exports = {
  validateLogin,
  validateChangePassword,
  login,
  forgotPassword,
  resetPassword,
}
