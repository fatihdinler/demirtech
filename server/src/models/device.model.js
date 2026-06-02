const mongoose = require('mongoose')
const { Schema } = mongoose
const { v4: uuid } = require('uuid')
const { deviceTypes, deviceLocationTypes, deviceMeasurementTypes, } = require('../../constants')

const DeviceSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: uuid,
  },
  name: {
    type: String,
    required: [true, 'Cihaz adı gerekli'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  chipId: {
    type: String,
    trim: true,
    required: [true, 'ChipId gerekli'],
  },
  locationId: {
    type: String,
    ref: 'Location',
    default: null
  },
  deviceType: {
    type: String,
    required: [true, 'Cihaz tipi gerekli'],
    trim: true,
    enum: {
      values: deviceTypes,
    },
  },
  measurementType: {
    type: String,
    enum: {
      values: deviceMeasurementTypes,
    },
    required: [true, 'ölçüm tipi gerekli'],
  },
  mqttTopic: {
    type: String,
    default: '',
  },
  minValue: {
    type: Number,
    default: null,
  },
  maxValue: {
    type: Number,
    default: null,
  },
  causeContext: {
    environment: {
      type: String,
      enum: ['sealed', 'semi-open', 'controlled'],
      default: 'sealed',
    },
    cooling: {
      type: Boolean,
      default: true,
    },
    defrostCycle: {
      type: Boolean,
      default: false,
    },
    frequentAccess: {
      type: Boolean,
      default: false,
    },
  },
}, { timestamps: true })

module.exports = mongoose.model('Device', DeviceSchema)
