const mongoose = require('mongoose')
const { v4: uuid } = require('uuid')

const DeviceDataSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: uuid,
  },
  chipId: Number,
  value: Number,
  type: String,
  occurredTime: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('DeviceData', DeviceDataSchema)
