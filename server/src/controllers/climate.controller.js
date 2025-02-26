const asyncHandler = require('express-async-handler')
const httpStatus = require('http-status-codes')
const ClimateService = require('../services/climate.service')

const createClimate = asyncHandler(async (req, res) => {
  const climate = await ClimateService.createClimate(req.body)
  global.logger.info(`Climate created: ${climate.name} with id: ${climate.id}`)
  res.status(httpStatus.CREATED).json({
    status: 'SUCCESS',
    message: 'Climate created successfully',
    data: climate,
  })
})

const getClimates = asyncHandler(async (req, res) => {
  const climates = await ClimateService.getClimates()
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Climates retrieved successfully',
    data: climates,
  })
})

const getClimate = asyncHandler(async (req, res) => {
  const climate = await ClimateService.getClimate(req.params.id)
  if (!climate) {
    global.logger.error(`Climate not found: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Climate not found',
    })
  }
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Climate retrieved successfully',
    data: climate,
  })
})

const updateClimate = asyncHandler(async (req, res) => {
  const updatedClimate = await ClimateService.updateClimate(req.params.id, req.body)
  if (!updatedClimate) {
    global.logger.error(`Climate not found for update: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Climate not found for update',
    })
  }
  global.logger.info(`Climate updated: ${updatedClimate.name} with id: ${updatedClimate.id}`)
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Climate updated successfully',
    data: updatedClimate,
  })
})

const deleteClimate = asyncHandler(async (req, res) => {
  const deletedClimate = await ClimateService.deleteClimate(req.params.id)
  if (!deletedClimate) {
    global.logger.error(`Climate not found for delete: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Climate not found for delete',
    })
  }
  global.logger.info(`Climate deleted with id: ${req.params.id}`)
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Climate deleted successfully',
    data: deletedClimate,
  })
})

module.exports = {
  createClimate,
  getClimate,
  getClimates,
  updateClimate,
  deleteClimate,
}
