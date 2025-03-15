let ioInstance = null

function initSocket(io) {
  ioInstance = io
  console.log('Socket.io instance initialized.')
}

/**
 * Frontend tarafına device verisini gönderir.
 * @param {Object} data - Gönderilecek device verisi.
 */
function emitDeviceData(data) {
  if (!ioInstance) {
    console.error('Socket.io instance not initialized.')
    return
  }
  ioInstance.emit('device-data', data)
}

module.exports = { initSocket, emitDeviceData }
