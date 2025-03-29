const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { v4: uuid } = require('uuid')

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: uuid,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  branchId: {
    type: String,
    ref: 'Branch',
    required: [true, 'Şube bilgisi gerekli'],
  },
  role: {
    type: String,
    enum: ['super', 'client'],
    required: true
  },
  // isTempPassword: {
  //   type: Boolean,
  //   default: false
  // },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpiresAt: String,
  verificationToken: String,
  verificationTokenExpiresAt: String,
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
