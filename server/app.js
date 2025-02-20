const express = require('express')
const mqtt = require('mqtt')
const { createLogger, transports, format } = require('winston')
const cors = require('cors')
const { connectDb } = require('./src/helpers/database.helper')
const config = require('./src/config')
const client = mqtt.connect('mqtt://broker.emqx.io', { username: 'emqx', password: 'password' })
const deviceRoutes = require('./src/routes/device.route')
const customerRoutes = require('./src/routes/customer.route')
const branchRoutes = require('./src/routes/branch.route')

const app = express()
const port = config.DEMIRTECH_APPLICATION_PORT || 4001

app.use(express.json())
app.use(cors())

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

app.listen(port, async () => {
  try {
    console.log(`>>> DEMIRTECH API IS RUNNING ON http://localhost:${port}`)

    const { connection: db } = await connectDb()
    global.db = db
  } catch (error) {
    console.error(`Error in app.js: ${error.message}`)
  }
}), {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
}

app.use('/api/devices', deviceRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/branches', branchRoutes)