const mongoose = require('mongoose')
const User = require('../models/user.model')
const Device = require('../models/device.model')
const Location = require('../models/location.model')
const DeviceData = require('../models/device-data.model')

const createLocation = async (data) => {
  const location = new Location(data)
  return await location.save()
}

const getLocations = async () => {
  return await Location.find()
}

const getLocation = async (id) => {
  return await Location.findOne({ id })
}

const updateLocation = async (id, data) => {
  return await Location.findOneAndUpdate({ id }, data, { new: true })
}

const deleteLocation = async (id) => {
  const result = await Location.deleteOne({ id })
  return result.deletedCount > 0
}

const getLocationsByUserId = async (userId) => {
  const user = await User.findOne({ id: userId })
  if (!user) return []
  return await Location.find({ branchId: user.branchId })
}

async function generateLocationReport({ locationIds, startTime, endTime }) {
  const start = new Date(startTime)
  const end = new Date(endTime)

  const locations = await Location.find({ id: { $in: locationIds } }).lean()
  const devices = await Device.find({ locationId: { $in: locationIds } }).lean()

  const output = []

  for (const loc of locations) {
    const locDevices = devices.filter(d => d.locationId === loc.id)

    const devicesWithData = []

    for (const dev of locDevices) {
      const modelName = `Data_${dev.id}`
      const collectionName = `data-${dev.id}`
      const schema = DeviceData.schema

      const Model = mongoose.models[modelName]
        || mongoose.model(modelName, schema, collectionName)

      const docs = await Model
        .find({ occurredTime: { $gte: start, $lte: end } })
        .sort({ occurredTime: 1 })
        .lean()

      const data = docs.map(({ occurredTime, value }) => ({
        occurredTime,
        value
      }))

      devicesWithData.push({
        deviceId: dev.id,
        name: dev.name,
        chipId: dev.chipId,
        deviceType: dev.deviceType,
        measurementType: dev.measurementType,
        data
      })
    }

    output.push({
      locationId: loc.id,
      locationName: loc.name,
      devices: devicesWithData
    })
  }

  return output
}

module.exports = {
  createLocation,
  getLocations,
  getLocation,
  updateLocation,
  deleteLocation,
  getLocationsByUserId,
  generateLocationReport,
}
