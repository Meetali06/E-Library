const Book = require('../models/Book')
const path = require('path')
const fs = require('fs')
const { Readable } = require('stream')

const EXTERNAL_MIN_QUERY_LENGTH = 3
const GUTENDEX_TIMEOUT_MS = 25000
const EXTERNAL_CACHE_TTL_MS = 10 * 60 * 1000
const externalSearchCache = new Map()
const inFlightExternalSearches = new Map()

const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 })
    res.json({ books })
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching books' })
  }
}

const addBook = async (req, res) => {
  try {
    const { title, author, category, description } = req.body

    if (!title || !category) {
      return res.status(400).json({ msg: 'Title and category are required' })
    }

    const bookData = { title, author, category, description }

    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        bookData.imageUrl = '/uploads/' + req.files.image[0].filename
      }
      if (req.files.pdf && req.files.pdf[0]) {
        bookData.pdfUrl = '/uploads/' + req.files.pdf[0].filename
      }
    }

    const book = new Book(bookData)
    await book.save()
    res.status(201).json({ msg: 'Book added successfully', book })
  } catch (err) {
    res.status(500).json({ msg: 'Error adding book' })
  }
}

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' })
    }

    // Delete associated files
    const uploadsDir = path.join(__dirname, '../../uploads')
    if (book.imageUrl) {
      const imgPath = path.join(uploadsDir, path.basename(book.imageUrl))
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath)
    }
    if (book.pdfUrl) {
      const pdfPath = path.join(uploadsDir, path.basename(book.pdfUrl))
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath)
    }

    await Book.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Book deleted successfully' })
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting book' })
  }
}

const searchExternalBooks = async (req, res) => {
  try {
    const query = (req.query.q || '').trim().toLowerCase()
    if (!query) {
      return res.status(400).json({ msg: 'Search query is required' })
    }

    if (query.length < EXTERNAL_MIN_QUERY_LENGTH) {
      return res.json({ results: [] })
    }

    const cachedEntry = externalSearchCache.get(query)
    if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
      return res.json({ results: cachedEntry.results })
    }

    if (inFlightExternalSearches.has(query)) {
      const pendingResults = await inFlightExternalSearches.get(query)
      return res.json({ results: pendingResults })
    }

    const searchPromise = searchGutendex(query)
      .then((results) => {
        externalSearchCache.set(query, {
          results,
          expiresAt: Date.now() + EXTERNAL_CACHE_TTL_MS
        })
        return results
      })
      .finally(() => {
        inFlightExternalSearches.delete(query)
      })

    inFlightExternalSearches.set(query, searchPromise)

    const results = await searchPromise
    return res.json({ results: results || [] })
  } catch (err) {
    console.error('Error in searchExternalBooks:', err.message)
    return res.json({ results: [] })
  }
}

const searchGutendex = async (query) => {
  try {
    console.log(`Searching Gutendex for: "${query}"`)
    const url = new URL('https://gutendex.com/books/')
    url.searchParams.set('search', query)
    url.searchParams.set('page', '1')

    const response = await fetch(url, { signal: AbortSignal.timeout(GUTENDEX_TIMEOUT_MS) })
    if (!response.ok) {
      throw new Error(`Gutendex HTTP ${response.status}`)
    }

    const data = await response.json()
    const allResults = data?.results || []
    console.log(`Gutendex returned ${allResults.length} total results`)

    const results = allResults
      .filter(book => {
        if (!book?.formats) return false
        // Keep books that can be read on Gutenberg (HTML/EPUB/PDF).
        const hasHtml = book.formats['text/html'] || book.formats['text/html; charset=utf-8']
        const hasPdf = book.formats['application/pdf']
        const hasEpub = book.formats['application/epub+zip']
        return hasHtml || hasPdf || hasEpub
      })
      .slice(0, 10)
      .map(book => ({
        id: book.id,
        title: book.title,
        authors: book.authors || [],
        formats: book.formats,
        cover_image: book.formats?.['image/jpeg'] || null
      }))

    console.log(`Gutendex filtered to ${results.length} readable results`)
    return results
  } catch (error) {
    console.error('Gutendex API error:', error.message)
    throw error
  }
}

const downloadExternalBook = async (req, res) => {
  try {
    const sourceUrl = (req.query.url || '').trim()
    const requestedName = (req.query.filename || '').trim()

    if (!sourceUrl) {
      return res.status(400).json({ msg: 'url query parameter is required' })
    }

    let parsed
    try {
      parsed = new URL(sourceUrl)
    } catch {
      return res.status(400).json({ msg: 'Invalid url' })
    }

    const allowedHosts = new Set(['www.gutenberg.org', 'gutendex.com'])
    if (!allowedHosts.has(parsed.hostname)) {
      return res.status(400).json({ msg: 'Unsupported download host' })
    }

    const upstream = await fetch(parsed.toString(), { signal: AbortSignal.timeout(30000) })
    if (!upstream.ok || !upstream.body) {
      return res.status(502).json({ msg: 'Failed to fetch source file' })
    }

    const pathName = decodeURIComponent(parsed.pathname || '')
    const inferredName = path.basename(pathName) || 'book'
    const safeRequestedName = requestedName.replace(/[\\/:*?"<>|]/g, '_')
    const fileName = (safeRequestedName || inferredName || 'book').slice(0, 180)

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    Readable.fromWeb(upstream.body).pipe(res)
  } catch (error) {
    console.error('downloadExternalBook error:', error.message)
    return res.status(500).json({ msg: 'Download failed' })
  }
}

module.exports = {
  getBooks,
  addBook,
  deleteBook,
  searchExternalBooks,
  downloadExternalBook
}
