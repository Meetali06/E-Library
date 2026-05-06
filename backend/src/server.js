const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

require('./config/env')
const connectDatabase = require('./config/database')

const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')
const adminRoutes = require('./routes/adminRoutes')
const statsRoutes = require('./routes/statsRoutes')
const contactRoutes = require('./routes/contactRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())

const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
app.use('/uploads', express.static(uploadsDir))

app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/contact', contactRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'E-Library backend is running' })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
