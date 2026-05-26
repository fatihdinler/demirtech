const Customer = require('../models/customer.model')
const Branch = require('../models/branch.model')
const Location = require('../models/location.model')
const Device = require('../models/device.model')
const { getDeviceDataModel, createDeviceDataCollection } = require('../helpers/device-data.helper')
const { emitDeviceData } = require('../helpers/socket.helper')
const { checkAndAlert } = require('../services/alert.service')
const { checkDeviceThresholds } = require('../services/notification.service')
const PROFILES = require('./profiles')

const TICK_INTERVAL_MS = 30_000
const SEED_COUNT = 150

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
      })
      await createDeviceDataCollection(device.id)
      console.log(`${LOG_PREFIX} Cihaz oluşturuldu: ${p.name} (chipId: ${p.chipId}, min: ${p.minValue}, max: ${p.maxValue})`)
    } else if (device.minValue == null && p.minValue != null) {
      await Device.findOneAndUpdate(
        { id: device.id },
        { minValue: p.minValue, maxValue: p.maxValue }
      )
      console.log(`${LOG_PREFIX} Cihaz eşikleri güncellendi: ${p.name} (min: ${p.minValue}, max: ${p.maxValue})`)
    }

    devices.push({ id: device.id, profileIdx: i })
  }

  return { locationId: location.id, devices }
}

async function seedHistoricalData(devices) {
  const now = Date.now()

  for (const { id: deviceId, profileIdx } of devices) {
    const Model = getDeviceDataModel(deviceId)
    const count = await Model.countDocuments()

    if (count >= SEED_COUNT) continue

    const profile = PROFILES[profileIdx]
    const toInsert = SEED_COUNT - count
    const docs = []

    for (let i = 0; i < toInsert; i++) {
      const step = count + i
      const value = profile.generate(step)
      docs.push({
        chipId: Number(profile.chipId),
        value,
        type: profile.measurementType.toLowerCase(),
        occurredTime: new Date(now - (toInsert - i) * TICK_INTERVAL_MS),
      })
    }

    if (docs.length > 0) {
      await Model.insertMany(docs)
      console.log(`${LOG_PREFIX} ${profile.name}: ${docs.length} geçmiş veri noktası seed edildi.`)
    }
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
        value: lastDoc.value,
        type: profile.measurementType.toLowerCase(),
        occurredTime: lastDoc.occurredTime,
      })
    }
  }
  console.log(`${LOG_PREFIX} İlk değerler Socket.IO üzerinden gönderildi.`)
}

function startContinuousGeneration(devices, startStep) {
  let tick = 0

  const writeTick = async () => {
    const currentStep = startStep + tick
    tick++

    for (const { id: deviceId, profileIdx } of devices) {
      const profile = PROFILES[profileIdx]

      try {
        const value = profile.generate(currentStep)
        const Model = getDeviceDataModel(deviceId)

        await Model.create({
          chipId: Number(profile.chipId),
          value,
          type: profile.measurementType.toLowerCase(),
          occurredTime: new Date(),
        })

        emitDeviceData({
          deviceId,
          chipId: Number(profile.chipId),
          value,
          type: profile.measurementType.toLowerCase(),
          occurredTime: new Date(),
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
        }).catch(() => {})
      } catch (err) {
        console.error(`${LOG_PREFIX} Veri yazma hatası (${profile.name}):`, err.message)
      }
    }

    if (tick % 20 === 0) {
      console.log(`${LOG_PREFIX} Aktif — ${tick} tick tamamlandı (step: ${currentStep})`)
    }
  }

  writeTick()

  const interval = setInterval(writeTick, TICK_INTERVAL_MS)

  process.on('SIGTERM', () => clearInterval(interval))
  process.on('SIGINT', () => clearInterval(interval))

  return interval
}

async function startSimulation() {
  try {
    console.log(`${LOG_PREFIX} Başlatılıyor...`)

    const { devices } = await seedEntities()
    console.log(`${LOG_PREFIX} ${devices.length} cihaz hazır.`)

    await seedHistoricalData(devices)
    console.log(`${LOG_PREFIX} Geçmiş veri kontrolü tamamlandı.`)

    const firstModel = getDeviceDataModel(devices[0].id)
    const existingCount = await firstModel.countDocuments()

    await emitInitialValues(devices)

    startContinuousGeneration(devices, existingCount)
    console.log(
      `${LOG_PREFIX} Sürekli veri üretimi başladı — ` +
      `${TICK_INTERVAL_MS / 1000}s aralıklarla ${devices.length} cihaz için veri yazılacak.`
    )
  } catch (err) {
    console.error(`${LOG_PREFIX} Başlatma hatası:`, err)
  }
}

module.exports = { startSimulation }
