const Location = require('../models/location.model')
const User = require('../models/user.model')

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

module.exports = {
  createLocation,
  getLocations,
  getLocation,
  updateLocation,
  deleteLocation,
  getLocationsByUserId,
}
