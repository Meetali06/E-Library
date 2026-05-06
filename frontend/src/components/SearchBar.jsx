import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBookPdfPath, toDirectPdfUrl } from '../utils/bookPdfPaths'

const MIN_QUERY_LENGTH = 1
const MIN_REMOTE_QUERY_LENGTH = 4
const DEBOUNCE_MS = 650
const REMOTE_COOLDOWN_MS = 1200
const MAX_RESULTS = 10
const MAX_LOCAL_RESULTS = 5
const MAX_REMOTE_RESULTS = 5
const DEFAULT_BOOK_COVER = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22150%22 height%3D%22200%22 viewBox%3D%220 0 150 200%22%3E%3Crect width%3D%22150%22 height%3D%22200%22 rx%3D%2212%22 fill%3D%22%23eceff3%22%2F%3E%3Cpath d%3D%22M35 30h55c8 0 15 7 15 15v110c-5-4-11-6-18-6H35z%22 fill%3D%22%23c8d0da%22%2F%3E%3Cpath d%3D%22M95 30h20c8 0 15 7 15 15v110c0 8-7 15-15 15h-20z%22 fill%3D%22%23dce3ea%22%2F%3E%3Ctext x%3D%2275%22 y%3D%22112%22 text-anchor%3D%22middle%22 font-size%3D%2218%22 font-family%3D%22Arial%2C sans-serif%22 fill%3D%22%23607080%22%3EBook%3C%2Ftext%3E%3C%2Fsvg%3E'
const API_BASE = import.meta.env.VITE_API_URL

const localBookRoutes = [
  '/book/rich-dad-poor-dad',
  '/book/think-and-grow-rich',
  '/book/give-and-take',
  '/book/resisting-happiness',
  '/book/three-mistakes',
  '/book/wings-of-fire',
  '/book/one-indian-girl',
  '/book/triumphant-church',
  '/book/digital-colour-graphic',
  '/book/maths-puzzle',
  '/book/art-of-work',
  '/book/stop-worrying',
  '/book/mystery-story',
  '/book/atomic-habits',
  '/book/the-alchemist',
  '/book/quiet-power-introverts',
  '/book/power-of-subconscious',
  '/book/the-kite-runner',
  '/book/two-states',
  '/book/steve-jobs',
  '/book/my-experiments-truth',
  '/book/sherlock-holmes',
  '/book/gone-girl',
  '/book/drawing-for-beginners',
  '/book/world-of-magic',
  '/book/the-mountain-is-you',
  '/book/brief-history-time',
  '/book/elegant-universe',
  '/book/mans-search-meaning',
  '/book/meditations',
  '/book/beyond-good-and-evil',
  '/book/pride-prejudice',
  '/book/the-notebook',
  '/book/sapiens',
  '/book/diary-young-girl',
  '/book/the-shining',
  '/book/dracula',
  '/book/rumi-poems',
  '/book/milk-and-honey',
  '/book/zero-to-one',
  '/book/intelligent-investor',
  '/book/why-we-sleep',
  '/book/born-to-run',
  '/book/harry-potter',
  '/book/charlottes-web',
  '/book/into-the-wild',
  '/book/eat-pray-love',
  '/book/maus',
  '/book/watchmen'
]

const normalizeText = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const slugToTitle = (url) => {
  const slug = (url.split('/book/')[1] || '').trim()
  if (!slug) return 'Untitled Book'

  return slug
    .split('-')
    .map(part => part ? part.charAt(0).toUpperCase() + part.slice(1) : part)
    .join(' ')
}

const curatedLocalBooks = [
  { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', category: 'Educational', url: '/book/rich-dad-poor-dad', img: '/images/Rich Dad Poor Dad eBook_0000.jpg' },
  { title: 'Think and Grow Rich', author: 'Napoleon Hill', category: 'Educational', url: '/book/think-and-grow-rich', img: 'https://m.media-amazon.com/images/I/61B84NiWabL._AC_UF1000,1000_QL80_.jpg' },
  { title: 'Give and Take', author: 'Adam Grant', category: 'Educational', url: '/book/give-and-take', img: 'https://m.media-amazon.com/images/I/51lRxELGt4L._AC_UF1000,1000_QL80_.jpg' },
  { title: 'Resisting Happiness', author: 'Matthew Kelly', category: 'Educational', url: '/book/resisting-happiness', img: '/images/Rh.png' },
  { title: 'Three Mistakes of My Life', author: 'Chetan Bhagat', category: 'Fiction', url: '/book/three-mistakes', img: 'https://files.cdn-files-a.com/uploads/4624183/2000_60fd2a5816f27.jpg' },
  { title: '2 States', author: 'Chetan Bhagat', category: 'Fiction', url: '/book/two-states', img: '/images/two-states.jpg' },
  { title: 'Beyond Good and Evil', author: 'Friedrich Nietzsche', category: 'Philosophy & Psychology', url: '/book/beyond-good-and-evil', img: '/images/beyond evil and good' },
  { title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', category: 'Fiction', url: '/book/wings-of-fire', img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1588286863i/634583.jpg' },
  { title: 'One Indian Girl', author: 'Chetan Bhagat', category: 'Fiction', url: '/book/one-indian-girl', img: '/images/indian-girls-book-covers' },
  { title: 'The Triumphant Church', author: 'Kenneth Hagin', category: 'Fiction', url: '/book/triumphant-church', img: 'https://imgproxy2.pdfroom.com/TRy4ZuS1uSmj9GhMWQIj_cEYKUy52W2WMJgsHHemEyU/rs:auto:0:800:0/g:no/cmE1MTdYTzZnSk8ucG5n.jpg' },
  { title: 'Introduction to Graphic Design', author: 'Unknown', category: 'Entertainment', url: '/book/digital-colour-graphic', img: 'https://rukminim2.flixcart.com/image/850/1000/l4ei1e80/book/8/b/p/introduction-to-graphic-design-original-imagfbfkdq2gzu3s.jpeg?q=90&crop=false' },
  { title: 'Maths Puzzle Book', author: 'Unknown', category: 'Entertainment', url: '/book/maths-puzzle', img: 'https://m.media-amazon.com/images/I/71Mp8OaKq8L._AC_UF1000,1000_QL80_.jpg' },
  { title: 'The Art of Work', author: 'Jeff Goins', category: 'Entertainment', url: '/book/art-of-work', img: '/images/ART.png' },
  { title: 'How to Stop Worrying and Start Living', author: 'Dale Carnegie', category: 'Entertainment', url: '/book/stop-worrying', img: '/images/SL.png' }
]

const localBooks = (() => {
  const byUrl = new Map()

  localBookRoutes.forEach((url) => {
    byUrl.set(url, {
      title: slugToTitle(url),
      author: 'E-Library',
      category: 'Library',
      url,
      img: DEFAULT_BOOK_COVER,
      pdfUrl: getBookPdfPath(url)
    })
  })

  curatedLocalBooks.forEach((book) => {
    byUrl.set(book.url, {
      ...(byUrl.get(book.url) || {}),
      ...book
    })
  })

  return Array.from(byUrl.values())
})()

function SearchBar() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const cacheRef = useRef(new Map())
  const requestRef = useRef({ id: 0, controller: null })
  const lastRemoteRequestAtRef = useRef(0)
  const lastRemoteQueryRef = useRef('')
  const lastRemoteResultsRef = useRef([])

  useEffect(() => {
    return () => {
      if (requestRef.current.controller) {
        requestRef.current.controller.abort()
      }
    }
  }, [])
  
  useEffect(() => {
    const query = searchQuery.trim()

    if (query.length < MIN_QUERY_LENGTH) {
      setShowResults(false)
      setSearchResults([])
      setLoading(false)
      if (requestRef.current.controller) {
        requestRef.current.controller.abort()
        requestRef.current.controller = null
      }
      return
    }

    const timeout = setTimeout(() => {
      performSearch(query, { forceRemote: false })
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [searchQuery])
  
  const searchGutendex = async (query, signal) => {
    try {
      const response = await fetch(`${API_BASE}/api/books/external-search?q=${encodeURIComponent(query)}`, { signal })
      if (!response.ok) return []

      const data = await response.json()
      return (data.results || []).slice(0, MAX_REMOTE_RESULTS)
    } catch (error) {
      if (error.name === 'AbortError') {
        return null
      }
      console.error('Gutendex API error:', error)
      return []
    }
  }

  const getCoverUrl = (book) => {
    if (book.formats && book.formats['image/jpeg']) {
      return book.formats['image/jpeg']
    }
    return DEFAULT_BOOK_COVER
  }

  const scoreLocalBook = (book, normalizedQuery) => {
    const title = normalizeText(book.title)
    const author = normalizeText(book.author)
    const category = normalizeText(book.category)
    const url = normalizeText(book.url)

    if (!normalizedQuery) return 0
    if (title === normalizedQuery) return 0
    if (title.startsWith(normalizedQuery)) return 1
    if (author.startsWith(normalizedQuery)) return 2
    if (category.startsWith(normalizedQuery)) return 3
    if (title.includes(normalizedQuery)) return 4
    if (author.includes(normalizedQuery)) return 5
    if (category.includes(normalizedQuery)) return 6
    if (url.includes(normalizedQuery)) return 7
    return 8
  }

  const sortLocalResults = (results, normalizedQuery) => {
    return [...results].sort((left, right) => {
      const leftScore = scoreLocalBook(left, normalizedQuery)
      const rightScore = scoreLocalBook(right, normalizedQuery)

      if (leftScore !== rightScore) return leftScore - rightScore
      return left.title.localeCompare(right.title)
    })
  }

  const mergeResults = (localResults, gutendexResults = []) => {
    const allResults = [...localResults.slice(0, MAX_LOCAL_RESULTS)]

    gutendexResults.forEach(book => {
      const exists = allResults.some(local =>
        local.title.toLowerCase() === (book.title || '').toLowerCase()
      )

      if (!exists && book.title) {
        let readUrl = '#'
        let pdfUrl = ''
        if (book.formats) {
          pdfUrl = book.formats['application/pdf'] || ''
          readUrl = book.formats['text/html; charset=utf-8']
            || book.formats['text/html']
            || book.formats['application/pdf']
            || (book.id ? `https://www.gutenberg.org/files/${book.id}/${book.id}-h/${book.id}-h.htm` : '#')
        }

        // Allow books with either PDF or HTML/readable format
        if (!pdfUrl && readUrl === '#') {
          return
        }

        allResults.push({
          title: book.title,
          author: book.authors && book.authors.length > 0 ? book.authors[0].name : 'Unknown Author',
          category: 'Gutenberg',
          gutenbergId: book.id,
          readUrl,
          pdfUrl,
          img: getCoverUrl(book),
          isExternal: true
        })
      }
    })

    return allResults.slice(0, MAX_RESULTS)
  }

  const getQuickRemoteMatches = (normalizedQuery) => {
    const rank = (book) => {
      const title = normalizeText(book.title || '')
      const author = normalizeText(book.authors?.[0]?.name || '')

      if (!normalizedQuery) return 99
      if (title === normalizedQuery) return 0
      if (title.startsWith(normalizedQuery)) return 1
      if (author.startsWith(normalizedQuery)) return 2
      if (title.includes(normalizedQuery)) return 3
      if (author.includes(normalizedQuery)) return 4
      return 99
    }

    const bestPrefixCache = [...cacheRef.current.entries()]
      .filter(([key]) => normalizedQuery.startsWith(key) || key.startsWith(normalizedQuery))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] || []

    const source = bestPrefixCache.length > 0 ? bestPrefixCache : lastRemoteResultsRef.current
    if (source.length === 0) return []

    return source
      .map((book) => ({ book, score: rank(book) }))
      .filter((item) => item.score < 99)
      .sort((left, right) => left.score - right.score)
      .slice(0, MAX_REMOTE_RESULTS)
      .map((item) => item.book)
  }
  
  const performSearch = async (query, options = {}) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return
    const { forceRemote = false } = options

    const normalizedQuery = normalizeText(trimmedQuery)

    const localResults = sortLocalResults(
      localBooks.filter(book =>
      normalizeText(book.title).includes(normalizedQuery) ||
      normalizeText(book.author).includes(normalizedQuery) ||
      normalizeText(book.category).includes(normalizedQuery) ||
      normalizeText(book.url).includes(normalizedQuery)
      ),
      normalizedQuery
    )

    setSearchResults(localResults.slice(0, MAX_LOCAL_RESULTS))
    setShowResults(true)

    if (trimmedQuery.length < MIN_REMOTE_QUERY_LENGTH) {
      setLoading(false)
      return
    }

    if (cacheRef.current.has(normalizedQuery)) {
      const cachedRemote = cacheRef.current.get(normalizedQuery)
      lastRemoteResultsRef.current = cachedRemote
      setSearchResults(mergeResults(localResults, cachedRemote))
      setLoading(false)
      return
    }

    const quickMatches = getQuickRemoteMatches(normalizedQuery)
    if (quickMatches.length > 0) {
      setSearchResults(mergeResults(localResults, quickMatches))
    }

    const now = Date.now()
    const elapsedSinceLastRemote = now - lastRemoteRequestAtRef.current
    if (!forceRemote && elapsedSinceLastRemote < REMOTE_COOLDOWN_MS) {
      setLoading(false)
      return
    }

    // Auto mode: avoid sending every partial keystroke to remote API.
    if (!forceRemote) {
      const previousRemoteQuery = lastRemoteQueryRef.current
      const isIncremental = previousRemoteQuery && normalizedQuery.startsWith(previousRemoteQuery)
      const charsAdded = normalizedQuery.length - previousRemoteQuery.length
      if (isIncremental && charsAdded > 0 && charsAdded < 3) {
        setLoading(false)
        return
      }
    }

    if (requestRef.current.controller) {
      requestRef.current.controller.abort()
    }

    const requestId = requestRef.current.id + 1
    const controller = new AbortController()
    requestRef.current = { id: requestId, controller }
    lastRemoteRequestAtRef.current = Date.now()
    lastRemoteQueryRef.current = normalizedQuery
    setLoading(true)

    const gutendexResults = await searchGutendex(trimmedQuery, controller.signal)

    if (gutendexResults === null || requestRef.current.id !== requestId) {
      setLoading(false)
      return
    }

    cacheRef.current.set(normalizedQuery, gutendexResults)
    lastRemoteResultsRef.current = gutendexResults
    setSearchResults(mergeResults(localResults, gutendexResults))
    setLoading(false)
  }
  
  return (
    <div className="search-container me-3">
      <input
        type="text"
        className="form-control search-input"
        placeholder="Search books..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => searchResults.length > 0 && setShowResults(true)}
      />
      <button className="btn btn-success btn-search" type="button" onClick={() => performSearch(searchQuery, { forceRemote: true })}
      >
        <span style={{ fontSize: '18px' }}>&#128269;</span>
      </button>
      
      {showResults && (
        <div className="search-results show search-results-panel">
          {loading && (
            <div className="text-center py-2" style={{ borderBottom: '1px solid #eee' }}>
              <div className="spinner-border spinner-border-sm" role="status"></div>
              <p className="mt-2 mb-0" style={{ fontSize: '13px', color: '#666' }}>Searching...</p>
            </div>
          )}
          {searchResults.length > 0 ? (
            searchResults.map((book, index) => (
              <div key={index} className="search-result-item" onClick={() => {
                setShowResults(false)
                setSearchQuery('')

                if (book.isExternal) {
                  const externalId = encodeURIComponent(String(book.gutenbergId || ''))
                  const path = externalId ? `/book/gutenberg/${externalId}` : '/book/gutenberg'
                  navigate(path, {
                    state: {
                      title: book.title,
                      author: book.author,
                      readUrl: book.readUrl || book.pdfUrl,
                      img: book.img
                    }
                  })
                  return
                }

                const directPdfUrl = toDirectPdfUrl(book.pdfUrl || book.readUrl)

                if (directPdfUrl) {
                  window.open(directPdfUrl, '_blank', 'noopener,noreferrer')
                } else {
                  window.alert('No readable link is available for this result.')
                }
              }}>
                <img className="search-result-cover" src={book.img} alt={book.title} onError={(e) => { e.currentTarget.src = DEFAULT_BOOK_COVER }} />
                <div className="search-result-info" style={{ flex: 1 }}>
                  <div className="search-result-title" style={{ fontWeight: 600, fontSize: '14px', marginBottom: '3px' }}>{book.title}</div>
                  <div className="search-result-author" style={{ fontSize: '12px', color: '#666' }}>{book.author}</div>
                </div>
              </div>
            ))
          ) : !loading ? (
            <div className="no-results" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No books found. Try different keywords!
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchBar
