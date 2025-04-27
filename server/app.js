const express = require('express')
const http = require('http')
const mqtt = require('mqtt')
const { createLogger, transports, format } = require('winston')
const cors = require('cors')
require('dotenv').config()
const cookieParser = require('cookie-parser')

const { connectDb } = require('./src/helpers/database.helper')
const config = require('./src/config')
const { listenDevicesMqtt } = require('./src/helpers/mqtt.listener')
const { initSocket } = require('./src/helpers/socket.helper.js')

const customerRoutes = require('./src/routes/customer.route')
const branchRoutes = require('./src/routes/branch.route')
const locationRoutes = require('./src/routes/location.route')
const deviceRoutes = require('./src/routes/device.route')
const authRoutes = require('./src/routes/auth.route.js')
const userRoutes = require('./src/routes/user.route.js')

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

const port = config.DEMIRTECH_APPLICATION_PORT || 3000

const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

initSocket(io)

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

server.listen(port, async () => {
  try {
    console.log(`>>> DEMIRTECH API IS RUNNING ON http://localhost:${port}`)
    const { connection: db } = await connectDb()
    global.db = db
    await require('./src/helpers/db-scripts/index.js')()
    listenDevicesMqtt(global.mqttClient)
  } catch (error) {
    console.error(`Error in app.js: ${error.message}`)
  }
})

app.use('/api/customers', customerRoutes)
app.use('/api/branches', branchRoutes)
app.use('/api/locations', locationRoutes)
app.use('/api/devices', deviceRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.use((err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
})
