let ioInstance = null

// Her cihaz için en son yayınlanan değerin anlık görüntüsü (snapshot).
// Yeni bağlanan istemcilere, bir sonraki ölçüm tick'ini beklemeden mevcut
// değerleri anında göndermek için kullanılır.
const latestByDevice = new Map()

function initSocket(io) {
  ioInstance = io
  console.log('Socket.io instance initialized.')

  // Bir istemci bağlandığı anda tüm cihazların son bilinen değerlerini
  // SADECE o istemciye gönder. Böylece sayfa açılır açılmaz değerler görünür.
  io.on('connection', (socket) => {
    for (const data of latestByDevice.values()) {
      socket.emit('device-data', data)
    }
  })
}

function emitDeviceData(data) {
  if (data && data.deviceId != null) {
    latestByDevice.set(data.deviceId, data)
  }

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
