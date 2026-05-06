const express = require('express')
const multer = require('multer')
const path = require('path')
const { getBooks, addBook, deleteBook, searchExternalBooks, downloadExternalBook } = require('../controllers/bookController')

const router = express.Router()

// Multer config for book file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, allowed.includes(ext))
  } else if (file.fieldname === 'pdf') {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, ext === '.pdf')
  } else {
    cb(null, false)
  }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } })

router.get('/', getBooks)
router.get('/external-search', searchExternalBooks)
router.get('/external-download', downloadExternalBook)
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), addBook)
router.delete('/:id', deleteBook)

module.exports = router
