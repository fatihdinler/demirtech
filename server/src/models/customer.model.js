const mongoose = require('mongoose')
const { Schema } = mongoose
const { v4: uuid } = require('uuid')

const CustomerSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: uuid,
  },
  name: {
    type: String,
    required: [true, 'Müşteri adı gerekli'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: '',
  }
}, { timestamps: true })

module.exports = mongoose.model('Customer', CustomerSchema)
