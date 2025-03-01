const Device = require('../models/device.model')

const createDevice = async (data) => {
  const device = new Device(data)
  return await device.save()
}

const getDevices = async () => {
  return await Device.find()
}

const getDevice = async (id) => {
  return await Device.findOne({ id })
}

const updateDevice = async (id, data) => {
  return await Device.findOneAndUpdate({ id }, data, { new: true })
}

const deleteDevice = async (id) => {
  const result = await Device.deleteOne({ id })
  return result.deletedCount > 0
}

module.exports = {
  createDevice,
  getDevices,
  getDevice,
  updateDevice,
  deleteDevice,
}
