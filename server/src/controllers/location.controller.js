const asyncHandler = require('express-async-handler')
const httpStatus = require('http-status-codes')
const LocationService = require('../services/location.service')

const createLocation = asyncHandler(async (req, res) => {
  const location = await LocationService.createLocation(req.body)
  global.logger.info(`Location created: ${location.name} with id: ${location.id}`)
  res.status(httpStatus.CREATED).json({
    status: 'SUCCESS',
    message: 'location created successfully',
    data: location,
  })
})

const getLocations = asyncHandler(async (req, res) => {
  const locations = await LocationService.getLocations()
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Locations retrieved successfully',
    data: locations,
  })
})

const getLocation = asyncHandler(async (req, res) => {
  const location = await LocationService.getLocation(req.params.id)
  if (!location) {
    global.logger.error(`Location not found: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Location not found',
    })
  }
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Location retrieved successfully',
    data: location,
  })
})

const updateLocation = asyncHandler(async (req, res) => {
  const updatedLocation = await LocationService.updateLocation(req.params.id, req.body)
  if (!updatedLocation) {
    global.logger.error(`Location not found for update: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Location not found for update',
    })
  }
  global.logger.info(`Location updated: ${updatedLocation.name} with id: ${updatedLocation.id}`)
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Location updated successfully',
    data: updatedLocation,
  })
})

const deleteLocation = asyncHandler(async (req, res) => {
  const deletedLocation = await LocationService.deleteLocation(req.params.id)
  if (!deletedLocation) {
    global.logger.error(`Location not found for delete: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Location not found for delete',
    })
  }
  global.logger.info(`Location deleted with id: ${req.params.id}`)
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Location deleted successfully',
    data: deletedLocation,
  })
})

const getLocationsByUserId = asyncHandler(async (req, res) => {
  const locations = await LocationService.getLocationsByUserId(req.userId)
  res.status(httpStatus.StatusCodes.OK).json({
    status: 'SUCCESS',
    message: 'Locations retrieved successfully for current user',
    data: locations,
  })
})

const getLocationReports = asyncHandler(async (req, res) => {
  const { locationIds, startTime, endTime } = req.body
  if (!locationIds?.length || !startTime || !endTime) {
    return res.status(400).json({ message: 'locationIds, startTime and endTime are required' })
  }

  const report = await LocationService.generateLocationReport({ locationIds, startTime, endTime })
  res.json({ data: report })
})

module.exports = {
  createLocation,
  getLocation,
  getLocations,
  updateLocation,
  deleteLocation,
  getLocationsByUserId,
  getLocationReports,
}
