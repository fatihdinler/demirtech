const mongoose = require('mongoose')
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
  },
  role: {
    type: String,
    enum: ['super', 'client'],
    required: true
  },
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

module.exports = mongoose.model('User', UserSchema)
