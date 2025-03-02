// src/helpers/mqttDevices.helper.js

const mongoose = require('mongoose');
const Devices = require('../models/device.model'); // Devices modelinizin doğru yolunu verin

// Dinamik koleksiyonlara insert edeceğimiz verinin temel şeması
const DeviceDataSchema = new mongoose.Schema({
  chipId: Number,
  value: Number,
  type: String,
  occurredTime: { type: Date, default: Date.now }
}, { versionKey: false });

/**
 * MQTT üzerinden gelen mesajları dinler, matching device'ları bulur ve her biri için
 * "data-<device.id>" isminde dinamik collection'a veriyi insert eder.
 */
async function listenDevicesMqtt() {
  const mqttClient = global.mqttClient;
  if (!mqttClient) {
    console.error("MQTT client tanımlı değil.");
    return;
  }

  // Tüm demirtech altındaki topic'leri dinlemek için wildcard kullanıyoruz
  mqttClient.subscribe('demirtech/#', (err) => {
    if (err) {
      console.error("Topic aboneliğinde hata:", err);
    } else {
      console.log("demirtech/# topic'lerine abone olundu.");
    }
  });

  mqttClient.on('message', async (receivedTopic, message) => {
    console.log(`Mesaj alındı - Topic: ${receivedTopic}`);
    let payload;
    try {
      payload = JSON.parse(message.toString());
    } catch (parseErr) {
      console.error("Gelen mesaj JSON parse edilemedi:", parseErr);
      return;
    }

    // Mesajda gerekli alanlar var mı kontrol edelim
    if (payload.chipId === undefined || !payload.type || typeof payload.value === 'undefined') {
      console.error("Mesaj gerekli alanları içermiyor:", payload);
      return;
    }

    // Devices collection'ında chipId'si gelen datadaki chipId ile eşleşen cihazları buluyoruz.
    // Gelen chipId number olduğu için Devices modelindeki chipId'yi string'e çeviriyoruz.
    const matchingDevices = await Devices.find({
      chipId: payload.chipId.toString()
    });
    console.log('payload --->', payload);
    console.log('Eşleşen cihazlar --->', matchingDevices);

    // Her bir eşleşen cihaz için ayrı collection oluşturup veriyi ekliyoruz
    for (const device of matchingDevices) {
      // Eğer device measurementType ile payload.type eşleşmiyorsa veri insert etmiyoruz.
      if (device.measurementType.toLowerCase() !== payload.type.toLowerCase()) {
        console.log(`Device ${device.id} measurement type uyuşmuyor. Beklenen: ${device.measurementType}, Gelen: ${payload.type}`);
        continue;
      }

      // Dinamik collection ismi: data-<device.id>
      const collectionName = `data-${device.id}`;
      console.log(`Veri, ${collectionName} collection'ına insert edilecek.`);

      // Eğer ilgili model daha önce oluşturulmamışsa oluşturuyoruz, aksi halde var olanı kullanıyoruz.
      const DeviceDataModel = mongoose.models[collectionName] || mongoose.model(collectionName, DeviceDataSchema);

      const newDeviceData = new DeviceDataModel({
        chipId: payload.chipId,
        value: payload.value,
        type: payload.type,
        occurredTime: new Date()
      });

      try {
        await newDeviceData.save();
        console.log(`Veri başarıyla insert edildi [${collectionName}], id: ${newDeviceData._id}`);
      } catch (err) {
        console.error(`Veri insert edilirken hata oluştu [${collectionName}]:`, err);
      }
    }
  });
}

module.exports = { listenDevicesMqtt };
