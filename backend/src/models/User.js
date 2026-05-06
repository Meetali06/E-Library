const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student', enum: ['student', 'admin'] },
  phone: String,
  department: String,
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)
