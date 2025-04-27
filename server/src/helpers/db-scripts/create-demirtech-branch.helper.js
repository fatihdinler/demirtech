const Customer = require('../../models/customer.model')
const Branch   = require('../../models/branch.model')
const asyncHandler = require('express-async-handler')

const createDemirtechBranch = asyncHandler(async () => {
  const customerName = 'Demirtech - System Customer'
  const branchName   = 'Demirtech - System Branch'

  // parent customer'ı bul
  const customer = await Customer.findOne({ name: customerName })
  if (!customer) {
    console.error(`Customer "${customerName}" not found. Skipping branch creation.`)
    return
  }

  // eğer zaten varsa atla
  const existing = await Branch.findOne({ name: branchName })
  if (existing) {
    console.log('Demirtech branch already exists.')
    return
  }

  await Branch.create({
    customerId: customer.id,
    name: branchName,
    address: 'N/A',
    contactInfo: 'N/A'
  })
  console.log('Demirtech branch created.')
})

module.exports = createDemirtechBranch
