const asyncHandler = require('express-async-handler')
const httpStatus = require('http-status-codes')
const CustomerService = require('../services/customer.service')

const createCustomer = asyncHandler(async (req, res) => {
  const customer = await CustomerService.createCustomer(req.body)
  global.logger.info(`Customer created: ${customer.name} with id: ${customer.id}`)
  res.status(httpStatus.CREATED).json({
    status: 'SUCCESS',
    message: 'Customer created successfully',
    data: customer,
  })
})

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await CustomerService.getCustomers()
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Customers retrieved successfully',
    data: customers,
  })
})

const getCustomer = asyncHandler(async (req, res) => {
  const customer = await CustomerService.getCustomer(req.params.id)
  if (!customer) {
    global.logger.error(`Customer not found: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Customer not found',
    })
  }
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Customer retrieved successfully',
    data: customer,
  })
})

const updateCustomer = asyncHandler(async (req, res) => {
  const updatedCustomer = await CustomerService.updateCustomer(req.params.id, req.body)
  if (!updatedCustomer) {
    global.logger.error(`Customer not found for update: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Customer not found for update',
    })
  }
  global.logger.info(`Customer updated: ${updatedCustomer.name} with id: ${updatedCustomer.id}`)
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Customer updated successfully',
    data: updatedCustomer,
  })
})

const deleteCustomer = asyncHandler(async (req, res) => {
  const deletedCustomer = await CustomerService.deleteCustomer(req.params.id)
  if (!deletedCustomer) {
    global.logger.error(`Customer not found for delete: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Customer not found for delete',
    })
  }
  global.logger.info(`Customer deleted with id: ${req.params.id}`)
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Customer deleted successfully',
  })
})

module.exports = {
  createCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
}
