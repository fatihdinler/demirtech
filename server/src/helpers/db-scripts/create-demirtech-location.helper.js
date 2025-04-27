const Branch   = require('../../models/branch.model')
const Location = require('../../models/location.model')
const asyncHandler = require('express-async-handler')

const createDemirtechLocation = asyncHandler(async () => {
  const branchName   = 'Demirtech - System Branch'
  const locationName = 'Demirtech - System Location'

  // parent branch'i bul
  const branch = await Branch.findOne({ name: branchName })
  if (!branch) {
    console.error(`Branch "${branchName}" not found. Skipping location creation.`)
    return
  }

  // zaten varsa atla
  const existing = await Location.findOne({
    name: locationName,
    branchId: branch.id
  })
  if (existing) {
    console.log('Demirtech location already exists.')
    return
  }

  await Location.create({
    name:        locationName,
    description: 'Default system location',
    branchId:    branch.id
  })
  console.log('Demirtech location created.')
})

module.exports = createDemirtechLocation
