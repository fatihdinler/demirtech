const Climate = require('../models/climate.model')
const { climateModels } = require('../../constants')

const createClimate = async (data) => {
  const climate = new Climate(data)
  return await climate.save()
}

const getClimates = async () => {
  return await Climate.find()
}

const getClimate = async (id) => {
  return await Climate.findOne({ id })
}

const updateClimate = async (id, data) => {
  return await Climate.findOneAndUpdate({ id }, data, { new: true })
}

const deleteClimate = async (id) => {
  const result = await Climate.deleteOne({ id })
  return result.deletedCount > 0
}

module.exports = {
  createClimate,
  getClimates,
  getClimate,
  updateClimate,
  deleteClimate,
}
