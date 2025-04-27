const asyncHandler = require('express-async-handler')
const httpStatus = require('http-status-codes')
const DeviceService = require('../services/device.service')

const createDevice = asyncHandler(async (req, res) => {
  const device = await DeviceService.createDevice(req.body)
  global.logger.info(`Device created: ${device.name} with id: ${device.id}`)
  res.status(httpStatus.CREATED).json({
    status: 'SUCCESS',
    message: 'Device created successfully',
    data: device,
  })
})

const getDevices = asyncHandler(async (req, res) => {
  const devices = await DeviceService.getDevices()
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Devices retrieved successfully',
    data: devices,
  })
})

const getDevice = asyncHandler(async (req, res) => {
  const device = await DeviceService.getDevice(req.params.id)
  if (!device) {
    global.logger.error(`Device not found: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Device not found',
    })
  }
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Device retrieved successfully',
    data: device,
  })
})

const updateDevice = asyncHandler(async (req, res) => {
  const updatedDevice = await DeviceService.updateDevice(req.params.id, req.body)
  if (!updatedDevice) {
    global.logger.error(`Device not found for update: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Device not found for update',
    })
  }
  global.logger.info(`Device updated: ${updatedDevice.name} with id: ${updatedDevice.id}`)
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Device updated successfully',
    data: updatedDevice,
  })
})

const deleteDevice = asyncHandler(async (req, res) => {
  const deletedDevice = await DeviceService.deleteDevice(req.params.id)
  if (!deletedDevice) {
    global.logger.error(`Device not found for delete: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Device not found for delete',
    })
  }
  global.logger.info(`Device deleted with id: ${req.params.id}`)
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Device deleted successfully',
    data: deletedDevice
  })
})

const getDevicesByUserId = asyncHandler(async (req, res) => {
  const { locationId } = req.body

  const devices = await DeviceService.getDevicesByUserId(
    req.userId,
    locationId
  )
  res.status(httpStatus.StatusCodes.OK).json({
    status: 'SUCCESS',
    message: 'Devices retrieved successfully for this user and location',
    data: devices,
  })
})

module.exports = {
  createDevice,
  getDevices,
  getDevice,
  updateDevice,
  deleteDevice,
  getDevicesByUserId,
}
