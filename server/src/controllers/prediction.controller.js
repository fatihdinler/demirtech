const asyncHandler = require('express-async-handler')
const { StatusCodes } = require('http-status-codes')
const { getDeviceForecast } = require('../services/prediction.service')

/**
 * GET /api/devices/:id/forecast
 * Belirtilen cihaz için ARIMA tabanlı zaman serisi tahmini döner.
 */
const getForecast = asyncHandler(async (req, res) => {
  const { id } = req.params
  const result = await getDeviceForecast(id)
  res.status(StatusCodes.OK).json(result)
})

module.exports = { getForecast }
