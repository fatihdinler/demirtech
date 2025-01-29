const validateIdInParams = (req, res, next) => {
  const { id } = req.params

  if (!id) {
    return res.status(404).send({
      message: 'VALIDATION_FAILED',
      errors: [{ error: `ID field is required.` }],
    })
  }
  if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(id)) {
    return res.status(404).send({
      message: 'VALIDATION_FAILED',
      errors: [{ error: `ID should be a valid UUID.` }],
    })
  }
  next()
}

module.exports = {
  validateIdInParams,
}