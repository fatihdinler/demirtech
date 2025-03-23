const mongoose = require('mongoose')
const { v4: uuid } = require('uuid')

const TokenSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: uuid,
  },
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('Token', TokenSchema)
