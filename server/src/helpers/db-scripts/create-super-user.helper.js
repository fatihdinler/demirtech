const User = require('../../models/user.model')
const Branch = require('../../models/branch.model')
const asyncHandler = require('express-async-handler')

const createSuperUser = asyncHandler(async () => {
  const superUsername = process.env.DEMIRTECH_SUPER_USER_USERNAME
  const superPassword = process.env.DEMIRTECH_SUPER_USER_PASSWORD
  const superEmail = process.env.DEMIRTECH_SUPER_USER_EMAIL

  if (!superUsername || !superPassword || !superEmail) {
    console.error('Super user bilgileri env dosyasında tanımlı değil.')
    return
  }

  const existingSuper = await User.findOne({ role: 'super' })
  if (existingSuper) {
    console.log('Super user zaten mevcut.')
    return
  }

  let systemBranch = await Branch.findOne({ name: 'System Branch' })
  if (!systemBranch) {
    systemBranch = await Branch.create({
      customerId: 'system-customer',
      name: 'System Branch',
      address: 'N/A',
      contactInfo: 'N/A'
    })
    console.log('System Branch başarıyla oluşturuldu.')
  } else {
    console.log('System Branch zaten mevcut.')
  }

  const superUser = await User.create({
    name: 'System',
    surname: 'User',
    username: superUsername,
    password: superPassword,
    email: superEmail,
    role: 'super',
    isVerified: true,
    branchId: systemBranch.id,
  })

  console.log('Super user başarıyla oluşturuldu.')
})

module.exports = createSuperUser
