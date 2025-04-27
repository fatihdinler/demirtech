const asyncHandler                = require('express-async-handler')
const createDemirtechCustomer     = require('./create-demirtech-customer.helper')
const createDemirtechBranch       = require('./create-demirtech-branch.helper')
const createDemirtechLocation     = require('./create-demirtech-location.helper')
const createSuperUser             = require('./create-demirtech-user.helper')

/**
 * Bu fonksiyon sırayla:
 *  1) DemirTech customer
 *  2) System Branch
 *  3) System Location
 *  4) Super User
 * script’lerini çalıştırır.
 */
const executePipeliningDatabaseScript = asyncHandler(async () => {
  await createDemirtechCustomer()
  await createDemirtechBranch()
  await createDemirtechLocation()
  await createSuperUser()
})

module.exports = executePipeliningDatabaseScript
