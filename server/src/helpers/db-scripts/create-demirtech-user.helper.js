// src/helpers/db-scripts/create-super-user.helper.js

const User = require('../../models/user.model')
const Branch = require('../../models/branch.model')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')

const createSuperUser = asyncHandler(async () => {
  const superUsername = process.env.DEMIRTECH_SUPER_USER_USERNAME
  const superPassword = process.env.DEMIRTECH_SUPER_USER_PASSWORD
  const superEmail = process.env.DEMIRTECH_SUPER_USER_EMAIL

  if (!superUsername || !superPassword || !superEmail) {
    console.error('Super user bilgileri env dosyasında tanımlı değil.')
    return
  }

  // Zaten varsa çık
  const existingSuper = await User.findOne({ role: 'super' })
  if (existingSuper) {
    console.log('Super user zaten mevcut.')
    return
  }

  // Daha önce pipeline ile oluşturduğumuz branch'i bul
  const branch = await Branch.findOne({ name: 'Demirtech - System Branch' })
  if (!branch) {
    console.error('Demirtech - System Branch bulunamadı. Önce branch script\'ini çalıştırın.')
    return
  }

  // Parolayı hash’le
  const hashedPassword = await bcrypt.hash(superPassword, 10)

  // Süper kullanıcıyı oluştur
  const superUser = new User({
    name: 'System',
    surname: 'User',
    username: superUsername,
    password: hashedPassword,
    email: superEmail,
    role: 'super',
    isVerified: true,
    branchId: branch.id,
  })
  await superUser.save()
  console.log('Super user başarıyla oluşturuldu.')

  // Branch.userIds dizisine ekle (duplicate önlemi için $addToSet)
  await Branch.findOneAndUpdate(
    { id: branch.id },
    { $addToSet: { userIds: superUser.id } }
  )
  console.log('Super user, Demirtech - System Branch kullanıcılarına eklendi.')
})

module.exports = createSuperUser
