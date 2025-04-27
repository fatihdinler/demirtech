const mongoose = require('mongoose')
const { Schema } = mongoose
const { v4: uuid } = require('uuid')

const BranchSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: uuid,
  },
  customerId: {
    type: String,
    ref: 'Customer',
    required: [true, 'Müşteri bilgisi gerekli']
  },
  userIds: [{
    type: String,
    ref: 'User'
  }],
  name: {
    type: String,
    required: [true, 'Şube adı gerekli'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  contactInfo: {
    type: String,
    trim: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Branch', BranchSchema)
