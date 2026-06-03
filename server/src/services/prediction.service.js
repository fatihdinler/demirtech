const tf = require('@tensorflow/tfjs')
const Device = require('../models/device.model')
const { getDeviceDataModel } = require('../helpers/device-data.helper')
const { analyzeCauses } = require('./cause-analysis.service')

/**
 * LSTM (Long Short-Term Memory) Tabanlı Zaman Serisi Tahmin Motoru
 *
 * LSTM Hücre Denklemleri:
 *   Giriş kapısı  : iₜ = σ(Wᵢ · [hₜ₋₁, xₜ] + bᵢ)
 *   Unutma kapısı  : fₜ = σ(W_f · [hₜ₋₁, xₜ] + b_f)
 *   Aday hücre     : C̃ₜ = tanh(W_C · [hₜ₋₁, xₜ] + b_C)
 *   Hücre durumu   : Cₜ = fₜ ⊙ Cₜ₋₁ + iₜ ⊙ C̃ₜ
 *   Çıkış kapısı   : oₜ = σ(Wₒ · [hₜ₋₁, xₜ] + bₒ)
 *   Gizli durum    : hₜ = oₜ ⊙ tanh(Cₜ)
 *
 * Neden ARIMA değil LSTM?
 *   - ARIMA doğrusal (linear) bir modeldir; IoT verilerindeki non-linear
 *     paternleri yakalayamaz.
 *   - LSTM, kapı mekanizmaları ile uzun ve kısa vadeli bağımlılıkları
 *     aynı anda öğrenebilir.
 *   - Ani sıçramalar, döngüsel paternler ve trend kırılmalarına ARIMA'dan
 *     çok daha iyi uyum sağlar.
 *
 * Mimari:
 *   Input → LSTM(32) → Dropout(0.15) → Dense(16, ReLU) → Dense(1, Linear)
 *
 * Hiperparametreler:
 *   - Window Size (lookback) : 10
 *   - Epochs                 : 30
 *   - Learning Rate          : 0.002 (Adam optimizer)
 *   - Batch Size             : 32
 *   - Validation Split       : 0.15
 */

const TRAINING_LIMIT =250
const HISTORY_CHART = 40
const FORECAST_STEPS = 12
const MIN_DATA_POINTS = 5
const WINDOW_SIZE = 15
const LSTM_UNITS = 32
const DENSE_UNITS = 16
const EPOCHS = 30
const BATCH_SIZE = 32
const LEARNING_RATE = 0.001
const VALIDATION_SPLIT = 0.15
const DROPOUT_RATE = 0.15
const CACHE_RETRAIN_THRESHOLD = 50

const FORECAST_INTERVALS = {
  hourly: 5 * 60 * 1000,       // 5 dk × 12 adım = 1 saat
  daily: 2 * 60 * 60 * 1000,   // 2 saat × 12 adım = 24 saat
}

const modelCache = new Map()

function buildLSTMModel() {
  const model = tf.sequential()

  model.add(tf.layers.lstm({
    units: LSTM_UNITS,
    inputShape: [WINDOW_SIZE, 1],
    returnSequences: false,
    kernelInitializer: 'glorotNormal',
    recurrentInitializer: 'glorotNormal',
  }))

  model.add(tf.layers.dropout({ rate: DROPOUT_RATE }))

  model.add(tf.layers.dense({
    units: DENSE_UNITS,
    activation: 'relu',
    kernelInitializer: 'glorotNormal',
  }))

  model.add(tf.layers.dense({
    units: 1,
    activation: 'linear',
  }))

  model.compile({
    optimizer: tf.train.adam(LEARNING_RATE),
    loss: 'meanSquaredError',
    metrics: ['mse'],
  })

  return model
}

/**
 * Min-Max normalizasyonu: x' = (x - min) / (max - min)
 * Ters dönüşüm        : x  = x' * (max - min) + min
 *
 * stableBounds verilirse normalizasyon sabit kalır ve model
 * cache'i güvenle yeniden kullanılabilir.
 */
function normalizeData(data, stableBounds) {
  const min = stableBounds ? stableBounds.min : Math.min(...data)
  const max = stableBounds ? stableBounds.max : Math.max(...data)
  const range = max - min || 1
  const normalized = data.map(v => (v - min) / range)
  return { normalized, min, max, range }
}

function denormalize(value, min, range) {
  return value * range + min
}

/**
 * Sliding window ile eğitim verisi oluşturur.
 * Her pencere [t-W, t-1] aralığını girdi, t anını hedef olarak kullanır.
 */
function createSequences(normalizedData) {
  const X = []
  const y = []
  for (let i = WINDOW_SIZE; i < normalizedData.length; i++) {
    X.push(normalizedData.slice(i - WINDOW_SIZE, i).map(v => [v]))
    y.push(normalizedData[i])
  }
  return { X, y }
}

/**
 * Değerlendirme metrikleri hesaplar:
 *   MAE  = (1/n) Σ|yᵢ - ŷᵢ|
 *   RMSE = √((1/n) Σ(yᵢ - ŷᵢ)²)
 *   MAPE = (100/n) Σ|yᵢ - ŷᵢ| / |yᵢ|
 *   R²   = 1 - Σ(yᵢ - ŷᵢ)² / Σ(yᵢ - ȳ)²
 */
function computeMetrics(actual, predicted) {
  const n = actual.length
  if (n === 0) return { mae: 0, rmse: 0, mape: 0, r2: 0 }

  const meanActual = actual.reduce((s, v) => s + v, 0) / n
  let sumAE = 0, sumSE = 0, sumAPE = 0, sumSS_tot = 0

  for (let i = 0; i < n; i++) {
    const error = actual[i] - predicted[i]
    sumAE += Math.abs(error)
    sumSE += error * error
    if (Math.abs(actual[i]) > 0.01) {
      sumAPE += Math.abs(error / actual[i])
    }
    sumSS_tot += (actual[i] - meanActual) ** 2
  }

  return {
    mae: parseFloat((sumAE / n).toFixed(4)),
    rmse: parseFloat(Math.sqrt(sumSE / n).toFixed(4)),
    mape: parseFloat(((sumAPE / n) * 100).toFixed(2)),
    r2: parseFloat((sumSS_tot > 0 ? 1 - sumSE / sumSS_tot : 0).toFixed(4)),
  }
}

/**
 * LSTM modelini eğitir veya cache'den yükler.
 */
// deviceId yerine cacheKey parametresi alacak şekilde güncellendi
async function trainOrLoadModel(cacheKey, normalizedData, normParams) {
    const cached = modelCache.get(cacheKey)
    const dataHash = normalizedData.length

    if (cached && Math.abs(cached.dataLength - dataHash) < CACHE_RETRAIN_THRESHOLD) {
        return cached
    }

    if (cached?.model) {
        cached.model.dispose()
    }

    const model = buildLSTMModel()
    const { X, y } = createSequences(normalizedData)

    if (X.length < 5) {
        model.dispose()
        return null
    }

    const xs = tf.tensor3d(X)
    const ys = tf.tensor2d(y, [y.length, 1])

    let trainingHistory
    try {
        trainingHistory = await model.fit(xs, ys, {
            epochs: EPOCHS,
            batchSize: Math.min(BATCH_SIZE, X.length),
            validationSplit: VALIDATION_SPLIT,
            shuffle: true,
            verbose: 0,
        })
    } finally {
        xs.dispose()
        ys.dispose()
    }

    const valLoss = trainingHistory.history.val_loss
    const finalValLoss = valLoss ? valLoss[valLoss.length - 1] : null

    const splitIdx = Math.floor(X.length * (1 - VALIDATION_SPLIT))
    const valX = X.slice(splitIdx)
    const valY = y.slice(splitIdx)

    let metrics = { mae: 0, rmse: 0, mape: 0, r2: 0 }
    let predStdDev = 1.0

    if (valX.length > 0) {
        const valInput = tf.tensor3d(valX)
        const valPred = model.predict(valInput)
        const predValues = valPred.dataSync()
        valInput.dispose()
        valPred.dispose()

        const validationPredictions = Array.from(predValues).map(v => denormalize(v, normParams.min, normParams.range))
        const validationActuals = valY.map(v => denormalize(v, normParams.min, normParams.range))

        metrics = computeMetrics(validationActuals, validationPredictions)

        const errors = validationActuals.map((a, i) => a - validationPredictions[i])
        predStdDev = errors.length > 1
            ? Math.sqrt(errors.reduce((s, e) => s + e * e, 0) / errors.length)
            : 1.0
    }

    const entry = {
        model,
        dataLength: dataHash,
        metrics,
        predStdDev,
        finalValLoss,
        trainedAt: new Date().toISOString(),
    }

    modelCache.set(cacheKey, entry)
    return entry
}

/**
 * Çok adımlı tahmin: son pencereyi kullanarak iteratif olarak tahmin üretir.
 * Her adımda bir önceki tahmin pencereye eklenerek sonraki adım hesaplanır.
 */
async function generateForecasts(model, lastWindow, steps, normParams, bounds) {
  const predictions = []
  const currentWindow = [...lastWindow]

  for (let i = 0; i < steps; i++) {
    const input = tf.tensor3d([currentWindow.map(v => [v])])
    const pred = model.predict(input)
    const normalizedPred = pred.dataSync()[0]
    input.dispose()
    pred.dispose()

    const rawValue = denormalize(normalizedPred, normParams.min, normParams.range)
    const clampedValue = Math.max(bounds.min, Math.min(bounds.max, rawValue))
    predictions.push(clampedValue)

    currentWindow.shift()
    currentWindow.push(normalizedPred)
  }

  return predictions
}

/**
 * LSTM tahminlerini fiziksel sınırlar içinde tutar.
 *   1. Mean reversion: İleri adımlarda tahmin kademeli olarak son ortalamanın
 *      etkisini alır — sonsuz ıraksama önlenir.
 *   2. Step-to-step limit: Ardışık adımlar arası fark recent stdDev × 1.5'i aşamaz.
 *   3. Cihaz aralığı: Tahmin, cihazın minValue–maxValue ± %30 marjından çıkamaz.
 */
function smoothPredictions(rawPredictions, recentValues, deviceMin, deviceMax) {
  const n = recentValues.length
  const recentMean = recentValues.reduce((a, b) => a + b, 0) / n
  const recentStd = Math.sqrt(
    recentValues.reduce((s, v) => s + (v - recentMean) ** 2, 0) / n
  ) || 0.5
  const lastActual = recentValues[n - 1]

  const hasDeviceBounds = deviceMin != null && deviceMax != null
  const range = hasDeviceBounds ? deviceMax - deviceMin : recentStd * 6
  const margin = range * 0.3
  const hardMin = hasDeviceBounds ? deviceMin - margin : recentMean - recentStd * 4
  const hardMax = hasDeviceBounds ? deviceMax + margin : recentMean + recentStd * 4

  const maxStepChange = Math.max(recentStd * 1.5, 0.3)

  const smoothed = []

  for (let i = 0; i < rawPredictions.length; i++) {
    let value = rawPredictions[i]

    const revertFactor = Math.min(0.04 * (i + 1), 0.4)
    value = value * (1 - revertFactor) + recentMean * revertFactor

    const prevValue = i === 0 ? lastActual : smoothed[i - 1]
    const delta = value - prevValue
    if (Math.abs(delta) > maxStepChange) {
      value = prevValue + Math.sign(delta) * maxStepChange
    }

    value = Math.max(hardMin, Math.min(hardMax, value))
    smoothed.push(parseFloat(value.toFixed(2)))
  }

  return smoothed
}

async function getDeviceForecast(deviceId, timeRange = 'hourly') {
    const device = await Device.findOne({ id: deviceId })
    if (!device) {
        const err = new Error('Cihaz bulunamadı.')
        err.statusCode = 404
        throw err
    }

    const Model = getDeviceDataModel(deviceId)
    let rawDocs = [];

    if (timeRange === 'daily') {
        // Eski hali: 24 saat kısıtlaması vardı
        // Yeni hali: Match kısmını kaldırıyoruz veya esnetiyoruz
        rawDocs = await Model.aggregate([
            // $match bloğunu tamamen kaldırıyoruz ki veritabanındaki TÜM veriyi çekebilelim
            {
                $group: {
                    _id: {
                        $dateTrunc: { date: "$occurredTime", unit: "minute", binSize: 30 }
                    },
                    value: { $avg: { $toDouble: "$value" } },
                    occurredTime: { $first: "$occurredTime" }
                }
            },
            { $sort: { occurredTime: -1 } },
            { $limit: 300 } // Limiti yükselttik
        ]);
    } else {
        rawDocs = await Model
            .find()
            .sort({ occurredTime: -1 })
            .limit(TRAINING_LIMIT)
            .lean();
    }
    const latestRaw = await Model.findOne().sort({ occurredTime: -1 }).lean();

    if (rawDocs.length < MIN_DATA_POINTS) {
        const err = new Error(
            `Tahmin için yetersiz veri. En az ${MIN_DATA_POINTS} ölçüm gereklidir, mevcut: ${rawDocs.length}.`
        )
        err.statusCode = 422
       // throw err
    }


    const docs = rawDocs.reverse()
    const timeSeries = docs.map(d => Number(d.value))

    const isHumidity = device.measurementType === 'HUMIDITY'
    let stableBounds = null
    if (device.minValue != null && device.maxValue != null) {
      const padding = (device.maxValue - device.minValue) * 0.5
      stableBounds = { min: device.minValue - padding, max: device.maxValue + padding }
    } else {
      stableBounds = isHumidity ? { min: 0, max: 100 } : { min: -10, max: 50 }
    }

    const normParams = normalizeData(timeSeries, stableBounds)

    const bounds = isHumidity ? { min: 0, max: 100 } : { min: -50, max: 80 }

    // cacheKey, cihaz kimliği ve zaman aralığının birleşimi yapıldı
    const cached = await trainOrLoadModel(`${deviceId}_${timeRange}`, normParams.normalized, normParams)

    if (!cached) {
        const err = new Error('LSTM modeli eğitilemedi: yetersiz pencere verisi.')
        err.statusCode = 500
        throw err
    }

    const { model, metrics, predStdDev } = cached

    const lastWindow = normParams.normalized.slice(-WINDOW_SIZE)
    const rawPredictions = await generateForecasts(model, lastWindow, FORECAST_STEPS, normParams, bounds)

    const recentSlice = timeSeries.slice(-Math.min(timeSeries.length, 20))
    const predictions = smoothPredictions(rawPredictions, recentSlice, device.minValue, device.maxValue)

    const forecastIntervalMs = FORECAST_INTERVALS[timeRange] || FORECAST_INTERVALS.hourly

    const lastTime = new Date(docs[docs.length - 1].occurredTime)
    const clamp = (v) => Math.max(bounds.min, Math.min(bounds.max, v))

    const forecast = predictions.map((value, i) => {
        const uncertainty = predStdDev * Math.sqrt(i + 1)
        return {
            time: new Date(lastTime.getTime() + forecastIntervalMs * (i + 1)).toISOString(),
            value,
            upper: parseFloat(clamp(value + 1.96 * uncertainty).toFixed(2)),
            lower: parseFloat(clamp(value - 1.96 * uncertainty).toFixed(2)),
        }
    })

    const firstPred = predictions[0]
    const lastPred = predictions[predictions.length - 1]
    const slope = (lastPred - firstPred) / FORECAST_STEPS
    const trend =
        Math.abs(slope) < 0.1 ? 'stable'
            : slope > 0 ? 'increasing'
                : 'decreasing'

  // YERİNE BUNU YAPIŞTIR:
    
    // --- YENİ EKLENEN: GEÇMİŞ TAHMİNLERİ HESAPLAMA (BATCH PREDICTION) ---
    const startIndex = Math.max(0, docs.length - HISTORY_CHART);
    const historicalWindows = [];
    const validIndices = [];

    // Her geçmiş veri noktası için modelin girdi penceresini (lookback) hazırlıyoruz
    for (let i = startIndex; i < docs.length; i++) {
        if (i >= WINDOW_SIZE) {
            const window = normParams.normalized.slice(i - WINDOW_SIZE, i);
            historicalWindows.push(window.map(v => [v]));
            validIndices.push(i);
        }
    }

    let pastPredictionsMap = new Map();
    if (historicalWindows.length > 0) {
        // Tek seferde (batch) tüm geçmişi tahmin ederek performansı koruyoruz
        const inputTensor = tf.tensor3d(historicalWindows);
        const predTensor = model.predict(inputTensor);
        const predArray = predTensor.dataSync();
        inputTensor.dispose();
        predTensor.dispose();

        validIndices.forEach((docIdx, idx) => {
            const rawPred = denormalize(predArray[idx], normParams.min, normParams.range);
            const clamped = Math.max(bounds.min, Math.min(bounds.max, rawPred));
            pastPredictionsMap.set(docIdx, parseFloat(clamped.toFixed(2)));
        });
    }

    const historical = docs.slice(-HISTORY_CHART).map((d, index) => {
        const absoluteIdx = startIndex + index;
        return {
            time: new Date(d.occurredTime).toISOString(),
            value: parseFloat(Number(d.value).toFixed(2)),
            // React'ın aradığı geçmiş tahmin verisi artık burada:
            predictedValue: pastPredictionsMap.has(absoluteIdx) ? pastPredictionsMap.get(absoluteIdx) : null
        };
    });
    // --- GEÇMİŞ TAHMİNLER EKLENTİSİ BİTTİ ---

    const allValues = timeSeries.slice(-HISTORY_CHART)
    const mean = allValues.reduce((s, v) => s + v, 0) / allValues.length
    const stdDev = Math.sqrt(
        allValues.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / allValues.length
    )

    const computedStats = {
        // "lastValue" artık her zaman ham veriden (latestRaw) gelecek
        lastValue: latestRaw ? parseFloat(Number(latestRaw.value).toFixed(2)) : parseFloat(timeSeries[timeSeries.length - 1].toFixed(2)),
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
        device.measurementType,
        device
    )

    return {
        deviceId,
        deviceName: device.name,
        chipId: device.chipId,
        measurementType: device.measurementType,
        historical,
        forecast,
        model: {
            algorithm: 'LSTM',
            description: `LSTM(${LSTM_UNITS}) → Dropout(${DROPOUT_RATE}) → Dense(${DENSE_UNITS}) → Dense(1)`,
            architecture: {
                lstmUnits: LSTM_UNITS,
                denseUnits: DENSE_UNITS,
                dropoutRate: DROPOUT_RATE,
                windowSize: WINDOW_SIZE,
                activationHidden: 'relu',
                activationOutput: 'linear',
                optimizer: `Adam(lr=${LEARNING_RATE})`,
                lossFunction: 'MSE (Mean Squared Error)',
            },
            hyperparameters: {
                epochs: EPOCHS,
                batchSize: BATCH_SIZE,
                learningRate: LEARNING_RATE,
                validationSplit: VALIDATION_SPLIT,
                windowSize: WINDOW_SIZE,
            },
            metrics,
            trainingPoints: docs.length,
            forecastSteps: FORECAST_STEPS,
            confidenceLevel: 0.95,
            trainedAt: cached.trainedAt,
        },
        trend,
        stats: computedStats,
        causes,
        generatedAt: new Date().toISOString(),
    }
}

module.exports = { getDeviceForecast }
