let ioInstance = null

function initSocket(io) {
  ioInstance = io
  console.log('Socket.io instance initialized.')
}

function emitDeviceData(data) {
  if (!ioInstance) {
    console.error('Socket.io instance not initialized.')
    return
  }
  ioInstance.emit('device-data', data)
}

function emitNotification(notification) {
  if (!ioInstance) {
    console.error('Socket.io instance not initialized.')
    return
  }
  ioInstance.emit('notification', notification)
}

module.exports = { initSocket, emitDeviceData, emitNotification }
