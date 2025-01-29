const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const DeviceSchema = mongoose.Schema({
  id: {
    type: String,
    unique: true,
    default: uuidv4
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  chipId: {
    type: String,
    require: true,
  },
  min: {
    type: Number,
    required: false,
    default: 0,
  },
  max: {
    type: Number,
    required: false,
    default: 0,
  },
  tolerance: {
    type: Number,
    required: false,
    default: 0,
  },
  measurementType: {
    type: String,
    enum: ['temperature', 'humidity', 'current'],
    required: true,
  },
  modelName: {
    type: String,
    enum: ['DT-100', 'DT-200', 'DT-300'],
    required: true,
  },
  color: {
    type: String,
    required: false,
    default: '#ffffff',
  },
}, {
  collection: 'devices',
  timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }
})

module.exports = mongoose.model('Device', DeviceSchema)
