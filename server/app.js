const express = require('express')
const http = require('http') // Node.js'in dahili modülü
const mqtt = require('mqtt')
const { createLogger, transports, format } = require('winston')
const cors = require('cors')
const { connectDb } = require('./src/helpers/database.helper')
const config = require('./src/config')
const { listenDevicesMqtt } = require('./src/helpers/mqtt.listener')
const { initSocket } = require('./src/helpers/socket.helper.js') // socketEmitter modülünü dahil ediyoruz

const customerRoutes = require('./src/routes/customer.route')
const branchRoutes = require('./src/routes/branch.route')
const climateRoutes = require('./src/routes/climate.route')
const deviceRoutes = require('./src/routes/device.route')

const app = express()
app.use(express.json())
app.use(cors())

const port = config.DEMIRTECH_APPLICATION_PORT || 3000

// HTTP server ve Socket.IO örneğini oluşturuyoruz.
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

// Socket.IO'yu başlatıyoruz.
initSocket(io)

// MQTT broker bağlantısını oluşturuyoruz.
const client = mqtt.connect('mqtt://broker.emqx.io', { username: 'emqx', password: 'password' })
global.mqttClient = client

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new transports.File({ filename: 'logs/app.log' }),
    new transports.Console()
  ]
})
global.logger = logger

// Veritabanına bağlanıp MQTT dinleyicisini başlatıyoruz.
server.listen(port, async () => {
  try {
    console.log(`>>> DEMIRTECH API IS RUNNING ON http://localhost:${port}`)
    const { connection: db } = await connectDb()
    global.db = db
    listenDevicesMqtt(global.mqttClient)
  } catch (error) {
    console.error(`Error in app.js: ${error.message}`)
  }
})

app.use('/api/customers', customerRoutes)
app.use('/api/branches', branchRoutes)
app.use('/api/climates', climateRoutes)
app.use('/api/devices', deviceRoutes)
