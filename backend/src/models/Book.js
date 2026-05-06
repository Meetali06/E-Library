const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  category: { type: String, required: true },
  description: String,
  imageUrl: String,
  pdfUrl: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Book', BookSchema)
