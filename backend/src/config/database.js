const mongoose = require('mongoose')

const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/elibrary'

  try {
    await mongoose.connect(mongoUri)
    console.log('MongoDB Connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = connectDatabase
