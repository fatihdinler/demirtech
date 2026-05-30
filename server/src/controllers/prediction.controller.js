const asyncHandler = require('express-async-handler')
const { StatusCodes } = require('http-status-codes')
const { getDeviceForecast } = require('../services/prediction.service')
const { checkPredictionThresholds } = require('../services/notification.service')
const Device = require('../models/device.model')

const getForecast = asyncHandler(async (req, res) => {
    const { id } = req.params
    // timeRange parametresi arayüzden alýnýyor
    const timeRange = req.query.timeRange || 'hourly'

    // timeRange servise iletiliyor
    const result = await getDeviceForecast(id, timeRange)

    const device = await Device.findOne({ id })
    if (device && (device.minValue != null || device.maxValue != null)) {
        checkPredictionThresholds({
            deviceId: device.id,
            deviceName: device.name,
            measurementType: device.measurementType,
            forecast: result.forecast,
            minValue: device.minValue,
            maxValue: device.maxValue,
        }).catch(err => {
            console.error(`[Prediction] Threshold notification error:`, err.message)
        })
    }

    res.status(StatusCodes.OK).json(result)
})

module.exports = { getForecast }