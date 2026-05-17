const ARIMA = require('arima')
const Device = require('../models/device.model')
const { getDeviceDataModel } = require('../helpers/device-data.helper')
const { analyzeCauses } = require('./cause-analysis.service')

/**
 * ARIMA (AutoRegressive Integrated Moving Average) tabanlı zaman serisi tahmini.
 *
 * Model: ARIMA(p, d, q)
 *   - AR(p): y_t = φ₁·y_{t-1} + ... + φ_p·y_{t-p} + ε_t
 *   - I(d) : d. dereceden fark alma → durağanlaştırma (stationarity)
 *   - MA(q): hata terimi modeli: θ₁·ε_{t-1} + ... + θ_q·ε_{t-q}
 *
 * Parametre seçimi: AIC/BIC kriteri ile otomatik (auto-ARIMA / Box-Jenkins yöntemi)
 * Güven aralığı: %95 → pred ± 1.96 · σ  (σ = √variance)
 */

const TRAINING_LIMIT = 150   // Eğitim için kullanılacak maksimum veri noktası sayısı
const HISTORY_CHART = 40     // Grafikte gösterilecek geçmiş veri noktası sayısı
const FORECAST_STEPS = 12    // Tahmin edilecek ileri adım sayısı
const MIN_DATA_POINTS = 15   // Minimum gerekli veri noktası sayısı

/**
 * Verilen cihaz ID'si için ARIMA tabanlı zaman serisi tahmini üretir.
 * @param {string} deviceId - Cihazın UUID formatındaki ID'si
 * @returns {Object} Tahmin sonuçları (geçmiş + gelecek + model bilgisi)
 */
async function getDeviceForecast(deviceId) {
  const device = await Device.findOne({ id: deviceId })
  if (!device) {
    const err = new Error('Cihaz bulunamadı.')
    err.statusCode = 404
    throw err
  }

  // Cihaza ait koleksiyondan son verileri çek (zaman sırasına göre artan)
  const Model = getDeviceDataModel(deviceId)
  const rawDocs = await Model
    .find()
    .sort({ occurredTime: -1 })
    .limit(TRAINING_LIMIT)
    .lean()

  if (rawDocs.length < MIN_DATA_POINTS) {
    const err = new Error(
      `Tahmin için yetersiz veri. En az ${MIN_DATA_POINTS} ölçüm gereklidir, mevcut: ${rawDocs.length}.`
    )
    err.statusCode = 422
    throw err
  }

  // Kronolojik sıraya çevir
  const docs = rawDocs.reverse()
  const timeSeries = docs.map(d => Number(d.value))

  // --- ARIMA Model Eğitimi ---
  let arima
  let modelParams = { p: 1, d: 1, q: 1 }

  try {
    // Önce auto-ARIMA dene (AIC kriterine göre en iyi parametreleri seçer)
    arima = new ARIMA({ auto: true, verbose: false }).train(timeSeries)
    modelParams = {
      p: typeof arima.p === 'number' ? arima.p : 1,
      d: typeof arima.d === 'number' ? arima.d : 1,
      q: typeof arima.q === 'number' ? arima.q : 1,
    }
  } catch (_autoError) {
    // Auto-ARIMA başarısız olursa ARIMA(1,1,1) ile devam et
    try {
      arima = new ARIMA({ p: 1, d: 1, q: 1, verbose: false }).train(timeSeries)
    } catch (fallbackError) {
      const err = new Error('ARIMA modeli eğitilemedi: ' + fallbackError.message)
      err.statusCode = 500
      throw err
    }
  }

  // --- Tahmin Üretimi ---
  let predictions, variances
  try {
    ;[predictions, variances] = arima.predict(FORECAST_STEPS)
  } catch (predictError) {
    const err = new Error('Tahmin üretilemedi: ' + predictError.message)
    err.statusCode = 500
    throw err
  }

  // Ortalama ölçüm aralığını hesapla (ms cinsinden)
  let avgIntervalMs = 60_000 // Varsayılan: 1 dakika
  if (docs.length > 1) {
    const sample = docs.slice(-Math.min(docs.length, 20))
    let sum = 0
    for (let i = 1; i < sample.length; i++) {
      sum += new Date(sample[i].occurredTime) - new Date(sample[i - 1].occurredTime)
    }
    const computed = sum / (sample.length - 1)
    if (computed > 0) avgIntervalMs = computed
  }

  const lastTime = new Date(docs[docs.length - 1].occurredTime)

  // Ölçüm tipine göre fiziksel sınırlar (ARIMA bu sınırları bilmez)
  const bounds = device.measurementType === 'HUMIDITY'
    ? { min: 0, max: 100 }
    : { min: -50, max: 80 }

  const clamp = (v) => Math.max(bounds.min, Math.min(bounds.max, v))

  // Tahmin serisi — %95 güven aralığı ile (z = 1.96)
  const forecast = predictions.map((value, i) => {
    const sigma = Math.sqrt(Math.abs(variances[i] || 0))
    const v = parseFloat(clamp(value).toFixed(2))
    return {
      time: new Date(lastTime.getTime() + avgIntervalMs * (i + 1)).toISOString(),
      value: v,
      upper: parseFloat(clamp(v + 1.96 * sigma).toFixed(2)),
      lower: parseFloat(clamp(v - 1.96 * sigma).toFixed(2)),
    }
  })

  // Trend analizi
  const firstPred = predictions[0]
  const lastPred = predictions[predictions.length - 1]
  const slope = (lastPred - firstPred) / FORECAST_STEPS
  const trend =
    Math.abs(slope) < 0.1 ? 'stable'
    : slope > 0 ? 'increasing'
    : 'decreasing'

  // Grafik için geçmiş veri (son HISTORY_CHART nokta)
  const historical = docs.slice(-HISTORY_CHART).map(d => ({
    time: new Date(d.occurredTime).toISOString(),
    value: parseFloat(Number(d.value).toFixed(2)),
  }))

  // Özet istatistikler
  const allValues = timeSeries.slice(-HISTORY_CHART)
  const mean = allValues.reduce((s, v) => s + v, 0) / allValues.length
  const stdDev = Math.sqrt(
    allValues.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / allValues.length
  )

  const computedStats = {
    lastValue: parseFloat(timeSeries[timeSeries.length - 1].toFixed(2)),
    mean: parseFloat(mean.toFixed(2)),
    stdDev: parseFloat(stdDev.toFixed(2)),
    nextPredicted: forecast[0]?.value ?? null,
  }

  const timestamps = docs.slice(-HISTORY_CHART).map(d => d.occurredTime)
  const causes = analyzeCauses(
    allValues,
    timestamps,
    forecast,
    computedStats,
    trend,
    device.measurementType
  )

  return {
    deviceId,
    deviceName: device.name,
    chipId: device.chipId,
    measurementType: device.measurementType,
    historical,
    forecast,
    model: {
      ...modelParams,
      algorithm: 'ARIMA',
      description: `ARIMA(${modelParams.p}, ${modelParams.d}, ${modelParams.q})`,
      trainingPoints: docs.length,
      forecastSteps: FORECAST_STEPS,
      confidenceLevel: 0.95,
    },
    trend,
    stats: computedStats,
    causes,
    generatedAt: new Date().toISOString(),
  }
}

module.exports = { getDeviceForecast }
