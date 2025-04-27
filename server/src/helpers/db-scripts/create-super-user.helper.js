const User = require('../../models/user.model')
const Branch = require('../../models/branch.model')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')   // ← bcryptjs’i ekliyoruz

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

  // System Branch’in varlığı
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

  // ——— Burada parolayı hash’liyoruz ———
  const hashedPassword = await bcrypt.hash(superPassword, 10)

  // Süper kullanıcıyı oluşturuyoruz, ancak düz parola yerine hash’lenmişi gönderiyoruz
  const superUser = new User({
    name: 'System',
    surname: 'User',
    username: superUsername,
    password: hashedPassword,    // ← hash’lenmiş parola
    email: superEmail,
    role: 'super',
    isVerified: true,
    branchId: systemBranch.id,
  })

  await superUser.save()
  console.log('Super user başarıyla oluşturuldu.')
})

module.exports = createSuperUser
