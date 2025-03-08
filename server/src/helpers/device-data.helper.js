// device-data.helper.js
const mongoose = require('mongoose')

const DeviceDataSchema = new mongoose.Schema({
  chipId: Number,
  value: Number,
  type: String,
  occurredTime: { type: Date, default: Date.now }
}, { versionKey: false });

function getDeviceDataModel(deviceId) {
  const collectionName = `data-${deviceId}`
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName]
  }
  return mongoose.model(collectionName, DeviceDataSchema, collectionName)
}

async function insertDeviceData(deviceId, payload) {
  const DeviceDataModel = getDeviceDataModel(deviceId)
  const newDeviceData = new DeviceDataModel({
    chipId: payload.chipId,
    value: payload.value,
    type: payload.type,
    occurredTime: new Date()
  })
  await newDeviceData.save()
  return newDeviceData
}

async function createDeviceDataCollection(deviceId) {
  getDeviceDataModel(deviceId);
  console.log(`Collection for device ${deviceId} ensured.`);
}

async function deleteDeviceDataCollection(deviceId) {
  const collectionName = `data-${deviceId}`;
  try {
    await mongoose.connection.dropCollection(collectionName);
    console.log(`Collection ${collectionName} dropped.`);
  } catch (err) {
    if (err.code === 26) {
      console.log(`Collection ${collectionName} does not exist.`);
    } else {
      throw err;
    }
  }
}

module.exports = {
  getDeviceDataModel,
  insertDeviceData,
  createDeviceDataCollection,
  deleteDeviceDataCollection,
};
