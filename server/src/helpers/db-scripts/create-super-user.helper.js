const User = require('../../models/user.model')
const asyncHandler = require('express-async-handler');

const createSuperUser = asyncHandler(async () => {
  const superUsername = process.env.DEMIRTECH_SUPER_USER_USERNAME;
  const superPassword = process.env.DEMIRTECH_SUPER_USER_PASSWORD;

  if (!superUsername || !superPassword) {
    console.error('Super user bilgileri env dosyasında tanımlı değil');
    return;
  }

  const existingSuper = await User.findOne({ role: 'super' });
  if (existingSuper) {
    console.log('Super user zaten mevcut.');
    return;
  }

  await User.create({
    username: superUsername,
    password: superPassword,
    role: 'super',
    isTempPassword: false
  });
  console.log('Super user başarıyla oluşturuldu.');
});

module.exports = createSuperUser;
