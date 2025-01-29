const mongoose = require('mongoose')
const config = require('../config')

mongoose.connection.on('connected', () => {
  console.log('>>> MongoDB connection established successfully')
})

mongoose.connection.on('error', (err) => {
  console.error('>>> MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('>>> MongoDB connection disconnected')
})

mongoose.connection.on('reconnected', () => {
  console.log('>>> MongoDB connection reconnected')
})

mongoose.connection.on('close', () => {
  console.log('>>> MongoDB connection closed')
})

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(config.DEMIRTECH_DATABASE_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('>>> Initial MongoDB connection established:', connection.connection.host)
    return connection
  } catch (error) {
    console.error('>>> Something went wrong while connecting to MongoDB:', error)
    throw new Error(error)
  }
}

const checkCollectionExists = async (collectionName) => {
  const collections = await mongoose.connection.db.listCollections({ name: collectionName }).toArray()
  return collections.length > 0
}

const checkAnyDocumentInsertedToCollection = async (collectionName) => {
  const collection = await global.db.collection(collectionName)
  return await collection.findOne({}, { sort: { $natural: -1 } })
}

module.exports = {
  connectDb,
  checkCollectionExists,
  checkAnyDocumentInsertedToCollection,
}
