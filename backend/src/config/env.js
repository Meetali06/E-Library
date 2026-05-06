const path = require('path')
const dotenv = require('dotenv')

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
})

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/elibrary',
  jwtSecret: process.env.JWT_SECRET || 'elibrary_secret_key_2024',
  nodeEnv: process.env.NODE_ENV || 'development'
}
