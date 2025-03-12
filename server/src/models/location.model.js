const mongoose = require('mongoose')
const { Schema } = mongoose
const { v4: uuid } = require('uuid')

const LocationSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: uuid,
  },
  name: {
    type: String,
    required: [true, 'Lokasyon adı gerekli'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  branchId: {
    type: String,
    ref: 'Branch',
    required: [true, 'Şube bilgisi gerekli']
  },
}, { timestamps: true })

module.exports = mongoose.model('Location', LocationSchema)
