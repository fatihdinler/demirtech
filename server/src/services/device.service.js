const mongoose = require('mongoose')
const Device = require('../models/device.model')
const User = require('../models/user.model')
const Location = require('../models/location.model')
const DeviceData = require('../models/device-data.model')
const { createDeviceDataCollection, deleteDeviceDataCollection } = require('../helpers/device-data.helper')

const createDevice = async (data) => {
  const device = new Device(data)
  device.mqttTopic = `demirtech/${data.chipId}/${data.measurementType.toLowerCase()}`
  const savedDevice = await device.save()
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
    await createDeviceDataCollection(updatedDevice.id)
  }
  return updatedDevice
}

const deleteDevice = async (id) => {
  const result = await Device.deleteOne({ id })
  if (result.deletedCount > 0) {
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

async function getReportsForDevices(deviceIds, startTime, endTime) {
  const schema = DeviceData.schema;
  const output = {}

  for (const id of deviceIds) {
    // model cache kontrolü
    const modelName = `Data_${id}`;
    const collectionName = `data-${id}`;
    const Model = mongoose.models[modelName]
      || mongoose.model(modelName, schema, collectionName);

    // istenen tarihler arasındaki dokümanları al, zaman sırasına göre sırala
    const docs = await Model
      .find({ occurredTime: { $gte: startTime, $lte: endTime } })
      .sort({ occurredTime: 1 })
      .lean();

    // sadece ihtiyacımız olan alanları alıp array’e çevir
    output[id] = docs.map(({ occurredTime, value }) => ({
      occurredTime,
      value
    }));
  }

  return output;
}

module.exports = {
  createDevice,
  getDevices,
  getDevice,
  updateDevice,
  deleteDevice,
  getDevicesByUserId,
  getReportsForDevices,
}
