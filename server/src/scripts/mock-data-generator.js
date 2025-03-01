// seed.js
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid')
const Customer = require('../models/customer.model');
const Branch = require('../models/branch.model');
const Climate = require('../models/climate.model');
const Device = require('../models/device.model');
const config = require('../config');

// Constants (constants.jsx benzeri sabitler)
const climateModels = ['CARRIER', 'DAIKIN', 'ARCELIK', 'FUJITSU', 'GENERAL', 'GREE', 'LG', 'MITSUBISHI', 'TOSHIBA', 'BOSCH', 'VESTEL', 'YORK'];
const deviceTypes = ['DT-100', 'DT-200', 'DT-300'];
const deviceLocationTypes = ['INTEGRATED', 'INDEPENDENT'];
const deviceMeasurementTypes = ['TEMPERATURE', 'HUMIDITY', 'CURRENT'];

// Sektöre uygun müşteri türleri ve Türkiye şehirleri
const customerTypes = ['Eczane', 'Fabrika', 'Soğuk Depo', 'Distribütör'];
const turkishCities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Adana', 'Antalya', 'Konya', 'Eskişehir', 'Gaziantep', 'Trabzon'];

// Yardımcı fonksiyonlar
function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Müşteri üretimi
function generateCustomer() {
  const id = uuid();
  const type = randomElement(customerTypes);
  const city = randomElement(turkishCities);
  const name = `${randomElement(['Acıbadem', 'Medipol', 'Şifa', 'Sağlık', 'Özlem'])} ${type}`;
  const description = `${name} ${city} bölgesinde faaliyet göstermektedir.`;
  return { id, name, description };
}

// Şube üretimi
function generateBranch(customerId) {
  const id = uuid();
  const city = randomElement(turkishCities);
  const name = `${randomElement(['Merkez', 'Şube', 'Depo'])} ${city}`;
  const address = `${city} - ${randomElement(['Cumhuriyet Mah.', 'Atatürk Cad.', 'İstiklal Sok.'])}, No: ${randomInt(1, 200)}`;
  const contactInfo = `0${randomInt(500, 599)}${randomInt(1000000, 9999999)}`;
  return { id, customerId, name, address, contactInfo };
}

// Klima üretimi
function generateClimate(branchId) {
  const id = uuid();
  const name = `Klima ${String.fromCharCode(65 + randomInt(0, 25))}`;
  const model = randomElement(climateModels);
  return { id, branchId, name, model };
}

// Cihaz üretimi
function generateDevice(branchId, climateId) {
  const id = uuid();
  const name = `Cihaz ${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  const chipId = randomInt(100000, 999999).toString();
  const deviceType = randomElement(deviceTypes);
  const deviceLocationType = randomElement(deviceLocationTypes);
  const measurementType = randomElement(deviceMeasurementTypes);
  const mqttTopic = `demirtech/${chipId}/${measurementType.toLowerCase()}`;
  return { id, branchId, climateId, name, chipId, deviceType, deviceLocationType, measurementType, mqttTopic };
}

// Ana seeding fonksiyonu
async function seed() {
  try {
    await mongoose.connect(config.DEMIRTECH_DATABASE_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Veritabanına bağlanıldı.");

    // Mevcut verileri temizle
    await Customer.deleteMany({});
    await Branch.deleteMany({});
    await Climate.deleteMany({});
    await Device.deleteMany({});

    const customers = [];
    const branches = [];
    const climates = [];
    const devices = [];

    // 3 müşteri üretimi
    for (let i = 0; i < 3; i++) {
      customers.push(generateCustomer());
    }
    await Customer.insertMany(customers);
    console.log("3 müşteri eklendi.");

    // Her müşteri için 5 şube üretimi => Toplam 3 * 5 = 15 şube
    for (const customer of customers) {
      for (let i = 0; i < 5; i++) {
        branches.push(generateBranch(customer.id));
      }
    }
    await Branch.insertMany(branches);
    console.log("15 şube eklendi.");

    // Her şube için 2 klima üretimi => Toplam 15 * 2 = 30 klima
    for (const branch of branches) {
      for (let i = 0; i < 2; i++) {
        climates.push(generateClimate(branch.id));
      }
    }
    await Climate.insertMany(climates);
    console.log("30 klima eklendi.");

    // Her şube için 4 cihaz üretimi => Toplam 15 * 4 = 60 cihaz
    for (const branch of branches) {
      // Şubeye ait 2 klima
      const branchClimates = climates.filter(climate => climate.branchId === branch.id);
      for (let i = 0; i < 4; i++) {
        const climateId = branchClimates.length ? randomElement(branchClimates).id : null;
        devices.push(generateDevice(branch.id, climateId));
      }
    }
    await Device.insertMany(devices);
    console.log("60 cihaz eklendi.");

    console.log("Mock data başarıyla oluşturuldu ve veritabanı dolduruldu.");
    process.exit();
  } catch (err) {
    console.error("Seeding sırasında hata:", err);
    process.exit(1);
  }
}

seed();
