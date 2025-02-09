const Customer = require('../models/customer.model')

const createCustomer = async (data) => {
  const customer = new Customer(data)
  return await customer.save()
}

const getCustomers = async () => {
  return await Customer.find()
}

const getCustomer = async (id) => {
  return await Customer.findOne({ id })
}

const updateCustomer = async (id, data) => {
  return await Customer.findOneAndUpdate({ id }, data, { new: true })
}

const deleteCustomer = async (id) => {
  const result = await Customer.deleteOne({ id })
  return result.deletedCount > 0
}

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
}
