const Customer = require('../models/customer.model')
const Branch = require('../models/branch.model')
const Location = require('../models/location.model')
const Device = require('../models/device.model')
const { getDeviceDataModel, createDeviceDataCollection } = require('../helpers/device-data.helper')
const { emitDeviceData } = require('../helpers/socket.helper')
const { checkAndAlert } = require('../services/alert.service')
const { checkDeviceThresholds } = require('../services/notification.service')
const PROFILES = require('./profiles')

const MINUTE_MS = 60_000
const TICK_INTERVAL_MS = MINUTE_MS          // Dakikada bir ölçüm → timeline'da dakika başına tek nokta
const HISTORY_MINUTES = 7 * 24 * 60          // Her cihaz için 1 haftalık geçmiş (10080 dakika)
const SEED_BATCH = 2000                      // insertMany toplu yazma boyutu

const CUSTOMER_NAME = 'Yıldız Soğuk Hava Depoculuk A.Ş.'
const BRANCH_NAME = 'Tuzla Merkez Depo'
const LOCATION_NAME = 'Ana Depo - Blok A'

const LOG_PREFIX = '[Simulator]'

async function seedEntities() {
  let customer = await Customer.findOne({ name: CUSTOMER_NAME })
  if (!customer) {
    customer = await Customer.create({
      name: CUSTOMER_NAME,
      description: 'Simülasyon müşterisi — soğuk hava deposu senaryoları',
    })
    console.log(`${LOG_PREFIX} Müşteri oluşturuldu: ${CUSTOMER_NAME}`)
  }

  let branch = await Branch.findOne({ name: BRANCH_NAME, customerId: customer.id })
  if (!branch) {
    branch = await Branch.create({
      customerId: customer.id,
      name: BRANCH_NAME,
      address: 'Tuzla OSB Mah. 3. Cadde No:42, Tuzla/İstanbul',
      contactInfo: '+90 216 000 00 00',
    })
    console.log(`${LOG_PREFIX} Şube oluşturuldu: ${BRANCH_NAME}`)
  }

  let location = await Location.findOne({ name: LOCATION_NAME, branchId: branch.id })
  if (!location) {
    location = await Location.create({
      name: LOCATION_NAME,
      description: 'Ana depo binası — Blok A, tüm soğuk oda ve reyon birimleri',
      branchId: branch.id,
      latitude: 40.8165,
      longitude: 29.3009,
    })
    console.log(`${LOG_PREFIX} Lokasyon oluşturuldu: ${LOCATION_NAME}`)
  } else if (location.latitude == null) {
    await Location.findOneAndUpdate(
      { id: location.id },
      { latitude: 40.8165, longitude: 29.3009 }
    )
  }

  const devices = []

  for (let i = 0; i < PROFILES.length; i++) {
    const p = PROFILES[i]
    let device = await Device.findOne({
      chipId: p.chipId,
      measurementType: p.measurementType,
    })

    if (!device) {
      device = await Device.create({
        name: p.name,
        chipId: p.chipId,
        measurementType: p.measurementType,
        deviceType: p.deviceType,
        locationId: location.id,
        isActive: true,
        description: '',
        minValue: p.minValue ?? null,
        maxValue: p.maxValue ?? null,
        causeContext: p.causeContext || null,
      })
      await createDeviceDataCollection(device.id)
      console.log(`${LOG_PREFIX} Cihaz oluşturuldu: ${p.name} (chipId: ${p.chipId}, min: ${p.minValue}, max: ${p.maxValue})`)
    } else {
      const needsUpdate =
        device.name !== p.name ||
        device.minValue !== p.minValue ||
        device.maxValue !== p.maxValue

      if (needsUpdate) {
        await Device.findOneAndUpdate(
          { id: device.id },
          { name: p.name, minValue: p.minValue, maxValue: p.maxValue, causeContext: p.causeContext || null }
        )
        console.log(`${LOG_PREFIX} Cihaz güncellendi: ${p.name} (min: ${p.minValue}, max: ${p.maxValue})`)
      }
    }

    devices.push({ id: device.id, profileIdx: i })
  }

  return { locationId: location.id, devices }
}

/**
 * Mutlak dakika indeksi. Step olarak bu kullanılır; böylece aynı gerçek dakika
 * her zaman aynı değeri/tahmini üretir (sunucu yeniden başlasa bile tutarlı).
 */
function minuteIndex(ms) {
  return Math.floor(ms / MINUTE_MS)
}

/**
 * Belirli bir dakika için ölçüm dokümanı (gerçek değer + tahmin) üretir.
 * occurredTime tam dakika sınırına hizalanır.
 */
function buildDoc(profile, minute) {
  return {
    chipId: Number(profile.chipId),
    value: profile.generate(minute),
    predictedValue: profile.predict(minute),
    type: profile.measurementType.toLowerCase(),
    occurredTime: new Date(minute * MINUTE_MS),
  }
}

async function insertInBatches(Model, docs) {
  for (let i = 0; i < docs.length; i += SEED_BATCH) {
    await Model.insertMany(docs.slice(i, i + SEED_BATCH), { ordered: false })
  }
}

/**
 * Her simülasyon cihazı için geçmişe dönük ~1 haftalık dakika-bazlı veri sağlar.
 *
 * Mantık:
 *   - Veri yoksa, eski formatta (predictedValue içermiyorsa) veya 1 haftadan
 *     eskiyse → koleksiyon temizlenir ve tam 1 hafta yeniden seed edilir.
 *   - Güncel veri varsa → yalnızca son ölçümden şimdiye kadarki boşluk doldurulur
 *     (yeniden başlatmalarda süreklilik korunur).
 *   - Her durumda 1 haftadan eski kayıtlar budanır (rolling 1 hafta).
 */
async function seedHistoricalData(devices) {
  const nowMinute = minuteIndex(Date.now())
  const startMinute = nowMinute - HISTORY_MINUTES

  for (const { id: deviceId, profileIdx } of devices) {
    const profile = PROFILES[profileIdx]
    const Model = getDeviceDataModel(deviceId)

    const latestDoc = await Model.findOne().sort({ occurredTime: -1 }).lean()
    const count = await Model.countDocuments()
    const latestMinute = latestDoc ? minuteIndex(new Date(latestDoc.occurredTime).getTime()) : null

    const doReseed =
      !latestDoc ||
      latestDoc.predictedValue == null ||        // eski format (tahmin yok)
      latestMinute < startMinute ||              // 1 haftadan eski
      count < HISTORY_MINUTES * 0.5              // yetersiz veri

    let fillFromMinute
    if (doReseed) {
      await Model.deleteMany({})
      fillFromMinute = startMinute
    } else {
      fillFromMinute = latestMinute + 1
    }

    const docs = []
    for (let m = fillFromMinute; m < nowMinute; m++) {
      docs.push(buildDoc(profile, m))
    }

    if (docs.length > 0) {
      await insertInBatches(Model, docs)
      console.log(
        `${LOG_PREFIX} ${profile.name}: ${docs.length} geçmiş veri noktası ${doReseed ? 'seed edildi (tam 1 hafta)' : 'boşluk dolduruldu'}.`
      )
    }

    // 1 haftadan eski kayıtları buda (rolling pencere)
    await Model.deleteMany({ occurredTime: { $lt: new Date(startMinute * MINUTE_MS) } })
  }
}

async function emitInitialValues(devices) {
  for (const { id: deviceId, profileIdx } of devices) {
    const profile = PROFILES[profileIdx]
    const Model = getDeviceDataModel(deviceId)
    const lastDoc = await Model.findOne().sort({ occurredTime: -1 }).lean()

    if (lastDoc) {
      emitDeviceData({
        deviceId,
        chipId: Number(profile.chipId),
        value: lastDoc.value?.toFixed(2),
        predictedValue: lastDoc.predictedValue ?? null,
        type: profile.measurementType.toLowerCase(),
        occurredTime: lastDoc.occurredTime,
      })
    }
  }
  console.log(`${LOG_PREFIX} İlk değerler Socket.IO üzerinden gönderildi.`)
}

function startContinuousGeneration(devices) {
  let tick = 0

  const writeTick = async () => {
    // Step = mutlak dakika indeksi; occurredTime tam dakika sınırına hizalı.
    const currentMinute = minuteIndex(Date.now())
    const occurredTime = new Date(currentMinute * MINUTE_MS)
    tick++

    for (const { id: deviceId, profileIdx } of devices) {
      const profile = PROFILES[profileIdx]

      try {
        const value = profile.generate(currentMinute)
        const predictedValue = profile.predict(currentMinute)
        const Model = getDeviceDataModel(deviceId)

        // Dakika başına tek kayıt: aynı dakika için upsert (idempotent).
        await Model.updateOne(
          { occurredTime },
          {
            $set: {
              chipId: Number(profile.chipId),
              value,
              predictedValue,
              type: profile.measurementType.toLowerCase(),
              occurredTime,
            },
          },
          { upsert: true }
        )

        emitDeviceData({
          deviceId,
          chipId: Number(profile.chipId),
          value: value?.toFixed(2),
          predictedValue,
          type: profile.measurementType.toLowerCase(),
          occurredTime,
        })

        checkAndAlert({
          deviceId,
          deviceName: profile.name,
          chipId: profile.chipId,
          measurementType: profile.measurementType,
          value,
        })

        checkDeviceThresholds({
          deviceId,
          deviceName: profile.name,
          measurementType: profile.measurementType,
          value,
          minValue: profile.minValue,
          maxValue: profile.maxValue,
          causeContext: profile.causeContext || null,
        }).catch(() => {})
      } catch (err) {
        console.error(`${LOG_PREFIX} Veri yazma hatası (${profile.name}):`, err.message)
      }
    }

    if (tick % 20 === 0) {
      console.log(`${LOG_PREFIX} Aktif — ${tick} tick tamamlandı (dakika: ${currentMinute})`)
    }
  }

  // Şimdiki dakikayı hemen yaz, sonraki tick'leri dakika sınırına hizala.
  writeTick()

  let interval = null
  const msToNextMinute = MINUTE_MS - (Date.now() % MINUTE_MS)
  const aligner = setTimeout(() => {
    writeTick()
    interval = setInterval(writeTick, TICK_INTERVAL_MS)
  }, msToNextMinute)

  const cleanup = () => {
    clearTimeout(aligner)
    if (interval) clearInterval(interval)
  }
  process.on('SIGTERM', cleanup)
  process.on('SIGINT', cleanup)

  return aligner
}

async function startSimulation() {
  try {
    console.log(`${LOG_PREFIX} Başlatılıyor...`)

    const { devices } = await seedEntities()
    console.log(`${LOG_PREFIX} ${devices.length} cihaz hazır.`)

    await seedHistoricalData(devices)
    console.log(`${LOG_PREFIX} Geçmiş veri (1 hafta) kontrolü tamamlandı.`)

    await emitInitialValues(devices)

    startContinuousGeneration(devices)
    console.log(
      `${LOG_PREFIX} Sürekli veri üretimi başladı — ` +
      `dakikada bir, ${devices.length} cihaz için ölçüm + tahmin yazılacak.`
    )
  } catch (err) {
    console.error(`${LOG_PREFIX} Başlatma hatası:`, err)
  }
}

module.exports = { startSimulation }
