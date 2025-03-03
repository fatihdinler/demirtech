const mongoose = require('mongoose')
const Devices = require('../models/device.model')

const DeviceDataSchema = new mongoose.Schema({
  chipId: Number,
  value: Number,
  type: String,
  occurredTime: { type: Date, default: Date.now }
}, { versionKey: false })

async function listenDevicesMqtt() {
  const mqttClient = global.mqttClient
  if (!mqttClient) {
    console.error("MQTT client tanımlı değil.")
    return
  }

  // Tüm demirtech altındaki topic'leri dinlemek için wildcard kullanıyoruz
  mqttClient.subscribe('demirtech/#', (err) => {
    if (err) {
      console.error("Topic aboneliğinde hata:", err)
    } else {
      console.log(`demirtech/# topic'lerine abone olundu.`)
    }
  })

  mqttClient.on('message', async (receivedTopic, message) => {
    console.log(`Mesaj alındı - Topic: ${receivedTopic}`)
    let payload
    try {
      payload = JSON.parse(message.toString())
    } catch (parseErr) {
      console.error("Gelen mesaj JSON parse edilemedi:", parseErr)
      return
    }

    // Mesajda gerekli alanlar var mı kontrol edelim
    if (payload.chipId === undefined || !payload.type || typeof payload.value === 'undefined') {
      console.error("Mesaj gerekli alanları içermiyor:", payload)
      return
    }

    const matchingDevices = await Devices.find({
      chipId: payload.chipId.toString()
    })

    for (const device of matchingDevices) {
      if (device.measurementType.toLowerCase() !== payload.type.toLowerCase()) {
        console.log(`Device ${device.id} measurement type uyuşmuyor. Beklenen: ${device.measurementType}, Gelen: ${payload.type}`)
        continue
      }

      // Dinamik collection ismi: data-<device.id>
      const collectionName = `data-${device.id}`
      console.log(`Veri, ${collectionName} collection'ına insert edilecek.`)

      // Eğer ilgili model daha önce oluşturulmamışsa oluşturuyoruz, aksi halde var olanı kullanıyoruz.
      const DeviceDataModel = mongoose.models[collectionName] || mongoose.model(collectionName, DeviceDataSchema)

      const newDeviceData = new DeviceDataModel({
        chipId: payload.chipId,
        value: payload.value,
        type: payload.type,
        occurredTime: new Date()
      })

      try {
        await newDeviceData.save()
        console.log(`Veri başarıyla insert edildi [${collectionName}], id: ${newDeviceData._id}`)
      } catch (err) {
        console.error(`Veri insert edilirken hata oluştu [${collectionName}]:`, err)
      }
    }
  })
}

module.exports = { listenDevicesMqtt }
