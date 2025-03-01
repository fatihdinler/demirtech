const mongoose = require('mongoose')
const { Schema } = mongoose
const { v4: uuid } = require('uuid')

const ClimateSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: uuid,
  },
  name: {
    type: String,
    required: [true, 'Klima adı gerekli'],
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
  model: {
    type: String,
    required: [true, 'Klima modeli gerekli'],
    trim: true
  },
}, { timestamps: true })

module.exports = mongoose.model('Climate', ClimateSchema)
