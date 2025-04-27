const Device = require('../models/device.model')
const User = require('../models/user.model')
const Location = require('../models/location.model')
const { createDeviceDataCollection, deleteDeviceDataCollection } = require('../helpers/device-data.helper')

const createDevice = async (data) => {
  const device = new Device(data)
  device.mqttTopic = `demirtech/${data.chipId}/${data.measurementType.toLowerCase()}`
  const savedDevice = await device.save()
  // Yeni device oluşturulduktan sonra ilgili data collection'ı oluşturuyoruz.
  await createDeviceDataCollection(savedDevice.id)
  return savedDevice
}

const getDevices = async () => {
  return await Device.find()
}

const getDevice = async (id) => {
  return await Device.findOne({ id })
}

const updateDevice = async (id, data) => {
  data.mqttTopic = `demirtech/${data.chipId}/${data.measurementType.toLowerCase()}`
  const updatedDevice = await Device.findOneAndUpdate({ id }, data, { new: true })
  if (updatedDevice) {
    // Güncelleme sonrası ilgili collection'ın varlığını garanti ediyoruz.
    await createDeviceDataCollection(updatedDevice.id)
  }
  return updatedDevice
}

const deleteDevice = async (id) => {
  const result = await Device.deleteOne({ id })
  if (result.deletedCount > 0) {
    // Device silindiğinde ilgili data collection'ı da siliyoruz.
    await deleteDeviceDataCollection(id)
    return true
  }
  return false
}

async function getDevicesByUserId(userId) {
  const user = await User.findOne({ id: userId })
  if (!user) return []

  const locations = await Location.find({ branchId: user.branchId }).select('id')
  if (!locations.length) return []

  const locationIds = locations.map(loc => loc.id)
  return await Device.find({ locationId: { $in: locationIds } })
}

module.exports = {
  createDevice,
  getDevices,
  getDevice,
  updateDevice,
  deleteDevice,
  getDevicesByUserId,
}
