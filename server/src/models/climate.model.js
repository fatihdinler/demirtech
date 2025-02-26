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
  branchId: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: [true, 'Şube bilgisi gerekli']
  },
  model: {
    type: String,
    required: [true, 'Klima modeli gerekli'],
    trim: true
  },
  installationDate: {
    type: Date,
  },
}, { timestamps: true })

module.exports = mongoose.model('Climate', ClimateSchema)
