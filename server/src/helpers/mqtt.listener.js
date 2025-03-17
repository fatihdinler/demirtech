const Device = require('../models/device.model')
const { insertDeviceData } = require('./device-data.helper')
const { emitDeviceData } = require('./socket.helper')

async function subscribeToWildcardTopic(mqttClient) {
  mqttClient.subscribe('demirtech/#', (err) => {
    if (err) {
      console.error("Error subscribing to wildcard topic 'demirtech/#':", err)
    } else {
      console.log("Subscribed to wildcard topic 'demirtech/#'.")
    }
  })
}

async function listenDevicesMqtt(mqttClient) {
  if (!mqttClient) {
    console.error("MQTT client is not defined.")
    return
  }

  await subscribeToWildcardTopic(mqttClient)

  mqttClient.on('message', async (receivedTopic, message) => {
    console.log(`Message received - Topic: ${receivedTopic}`)
    let payload
    try {
      payload = JSON.parse(message.toString())
    } catch (parseErr) {
      console.error("Error parsing message JSON:", parseErr)
      return
    }

    if (payload.chipId === undefined || !payload.type || typeof payload.value === 'undefined') {
      console.error("Message missing required fields:", payload)
      return
    }

    const matchingDevices = await Device.find({
      chipId: payload.chipId.toString()
    })

    if (!matchingDevices || matchingDevices.length === 0) {
      console.error(`No device found for chipId ${payload.chipId}`)
      return
    }

    for (const device of matchingDevices) {
      if (device.measurementType.toLowerCase() !== payload.type.toLowerCase()) {
        console.error(`Device ${device.id} measurement type mismatch. Expected: ${device.measurementType}, Received: ${payload.type}`)
        continue
      }

      if (device.isActive === false) return

      emitDeviceData({
        deviceId: device.id,
        chipId: payload.chipId,
        value: payload.value,
        type: payload.type,
        occurredTime: new Date()
      })

      insertDeviceData(device.id, payload)
        .then(inserted => {
          console.log(`Data inserted into collection data-${device.id}, id: ${inserted._id}`)
        })
        .catch(err => {
          console.error(`Error inserting data for device ${device.id}:`, err)
        })
    }
  })
}

module.exports = { listenDevicesMqtt }
