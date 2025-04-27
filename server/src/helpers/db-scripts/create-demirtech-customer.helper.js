const Customer = require('../../models/customer.model')
const asyncHandler = require('express-async-handler')

const createDemirtechCustomer = asyncHandler(async () => {
  const name = 'Demirtech - System Customer'
  const existing = await Customer.findOne({ name })
  if (existing) {
    console.log('Demirtech customer already exists.')
    return
  }
  await Customer.create({
    name,
    description: 'Default system customer'
  })
  console.log('Demirtech customer created.')
})

module.exports = createDemirtechCustomer
