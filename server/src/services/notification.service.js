const Notification = require('../models/notification.model')
const { emitNotification } = require('../helpers/socket.helper')

const NOTIFICATION_COOLDOWN_MS = 10 * 60 * 1000 // 10 dakika
const cooldownMap = new Map()

async function createNotification({ deviceId, deviceName, type, severity, title, message, value, threshold, measurementType }) {
  const cooldownKey = `${deviceId}-${type}-${severity}`
  const lastTime = cooldownMap.get(cooldownKey)
  if (lastTime && Date.now() - lastTime < NOTIFICATION_COOLDOWN_MS) return null

  cooldownMap.set(cooldownKey, Date.now())

  const notification = await Notification.create({
    deviceId,
    deviceName,
    type,
    severity,
    title,
    message,
    value,
    threshold,
    measurementType,
  })

  emitNotification({
    id: notification.id,
    deviceId: notification.deviceId,
    deviceName: notification.deviceName,
    type: notification.type,
    severity: notification.severity,
    title: notification.title,
    message: notification.message,
    value: notification.value,
    threshold: notification.threshold,
    measurementType: notification.measurementType,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  })

  return notification
}

async function getNotifications({ page = 1, limit = 30, unreadOnly = false }) {
  const filter = {}
  if (unreadOnly) filter.isRead = false

  const total = await Notification.countDocuments(filter)
  const notifications = await Notification
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  const unreadCount = await Notification.countDocuments({ isRead: false })

  return {
    notifications,
    unreadCount,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

async function markAsRead(notificationId) {
  return Notification.findOneAndUpdate(
    { id: notificationId },
    { isRead: true },
    { new: true }
  )
}

async function markAllAsRead() {
  return Notification.updateMany({ isRead: false }, { isRead: true })
}

async function getUnreadCount() {
  return Notification.countDocuments({ isRead: false })
}

/**
 * Cihaza ait min/max eşik kontrolü yapar.
 * MQTT üzerinden gelen her ölçümde çağrılır.
 */
async function checkDeviceThresholds({ deviceId, deviceName, measurementType, value, minValue, maxValue }) {
  const numValue = Number(value)
  const isTemp = (measurementType || '').toUpperCase() === 'TEMPERATURE'
  const unit = isTemp ? '°C' : '%'
  const label = isTemp ? 'Sıcaklık' : 'Nem'

  if (minValue != null && numValue < minValue) {
    await createNotification({
      deviceId,
      deviceName,
      type: 'threshold_exceeded',
      severity: numValue < minValue - (isTemp ? 5 : 10) ? 'critical' : 'warning',
      title: `${label} Minimum Eşik Aşımı`,
      message: `${deviceName} cihazının ${label.toLowerCase()} değeri (${numValue.toFixed(1)}${unit}) tanımlı minimum eşiğin (${minValue}${unit}) altına düşmüştür.`,
      value: numValue,
      threshold: { min: minValue, max: maxValue },
      measurementType,
    })
  }

  if (maxValue != null && numValue > maxValue) {
    await createNotification({
      deviceId,
      deviceName,
      type: 'threshold_exceeded',
      severity: numValue > maxValue + (isTemp ? 5 : 10) ? 'critical' : 'warning',
      title: `${label} Maksimum Eşik Aşımı`,
      message: `${deviceName} cihazının ${label.toLowerCase()} değeri (${numValue.toFixed(1)}${unit}) tanımlı maksimum eşiğin (${maxValue}${unit}) üstüne çıkmıştır.`,
      value: numValue,
      threshold: { min: minValue, max: maxValue },
      measurementType,
    })
  }
}

/**
 * Tahmin değerleri için eşik kontrolü yapar.
 * Forecast üretildikten sonra çağrılır.
 */
async function checkPredictionThresholds({ deviceId, deviceName, measurementType, forecast, minValue, maxValue }) {
  if (minValue == null && maxValue == null) return
  if (!forecast || !forecast.length) return

  const isTemp = (measurementType || '').toUpperCase() === 'TEMPERATURE'
  const unit = isTemp ? '°C' : '%'
  const label = isTemp ? 'Sıcaklık' : 'Nem'

  for (const f of forecast) {
    if (minValue != null && f.value < minValue) {
      await createNotification({
        deviceId,
        deviceName,
        type: 'prediction_alert',
        severity: 'warning',
        title: `${label} Tahmin Uyarısı — Düşüş Bekleniyor`,
        message: `${deviceName} cihazının tahmin edilen ${label.toLowerCase()} değeri (${f.value}${unit}) minimum eşiğin (${minValue}${unit}) altına düşebilir. Tahmini zaman: ${new Date(f.time).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}.`,
        value: f.value,
        threshold: { min: minValue, max: maxValue },
        measurementType,
      })
      break
    }

    if (maxValue != null && f.value > maxValue) {
      await createNotification({
        deviceId,
        deviceName,
        type: 'prediction_alert',
        severity: 'warning',
        title: `${label} Tahmin Uyarısı — Yükseliş Bekleniyor`,
        message: `${deviceName} cihazının tahmin edilen ${label.toLowerCase()} değeri (${f.value}${unit}) maksimum eşiğin (${maxValue}${unit}) üstüne çıkabilir. Tahmini zaman: ${new Date(f.time).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}.`,
        value: f.value,
        threshold: { min: minValue, max: maxValue },
        measurementType,
      })
      break
    }
  }
}

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  checkDeviceThresholds,
  checkPredictionThresholds,
}
