const mongoose = require('mongoose')
const { Schema } = mongoose
const { v4: uuid } = require('uuid')

const NotificationSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: uuid,
  },
  deviceId: {
    type: String,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['threshold_exceeded', 'prediction_alert', 'anomaly_detected'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['warning', 'critical'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    default: null,
  },
  threshold: {
    min: { type: Number, default: null },
    max: { type: Number, default: null },
  },
  measurementType: {
    type: String,
    default: 'TEMPERATURE',
  },
  cause: {
    title: { type: String, default: null },
    description: { type: String, default: null },
    confidence: { type: String, enum: ['high', 'medium', 'low'], default: null },
    recommendations: [{ type: String }],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

NotificationSchema.index({ createdAt: -1 })
NotificationSchema.index({ isRead: 1 })

module.exports = mongoose.model('Notification', NotificationSchema)
