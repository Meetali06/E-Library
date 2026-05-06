import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { addBookToHistory } from '../utils/historyStorage'
import { isBookFavorite, toggleBookFavorite } from '../utils/favoritesStorage'
import { getCurrentTheme, getThemeColors, setTheme, toggleTheme } from '../utils/themeStorage'

function BookViewer({ title, pdfPath, description, coverImage }) {
  const location = useLocation()
  const hasPdf = Boolean(pdfPath)
  const [fileStatus, setFileStatus] = useState('checking')
  const [isFavorite, setIsFavorite] = useState(false)
  const [theme, setThemeState] = useState(getCurrentTheme())
  const encodedBookPath = useMemo(() => {
    if (!pdfPath) return ''

    // Encode only the file name part so spaces and special chars resolve correctly.
    if (pdfPath.startsWith('/books/')) {
      const fileName = pdfPath.slice('/books/'.length)
      return `/books/${encodeURIComponent(fileName)}`
    }

    return encodeURI(pdfPath)
  }, [pdfPath])
  const isPdfFile = /\.pdf($|[?#])/i.test(encodedBookPath)
  const favoritePayload = {
    title,
    author: '',
    description: description || '',
    path: location.pathname,
    readUrl: encodedBookPath,
    img: coverImage || '',
    source: 'library'
  }

  useEffect(() => {
    let cancelled = false

    const verifyFile = async () => {
      if (!hasPdf) {
        setFileStatus('missing')
        return
      }

      setFileStatus('checking')

      try {
        const response = await fetch(encodedBookPath, { method: 'HEAD' })
        if (!cancelled) {
          setFileStatus(response.ok ? 'ready' : 'missing')
        }
      } catch {
        if (!cancelled) setFileStatus('missing')
      }
    }

    verifyFile()
    return () => { cancelled = true }
  }, [hasPdf, encodedBookPath])

  useEffect(() => {
    addBookToHistory({
      title,
      description,
      path: location.pathname,
      source: 'library'
    })
  }, [title, description, location.pathname])

  useEffect(() => {
    setIsFavorite(isBookFavorite(favoritePayload))
  }, [title, description, location.pathname, encodedBookPath, coverImage])

  const handleToggleFavorite = () => {
    const next = toggleBookFavorite(favoritePayload)
    setIsFavorite(next)
  }

  const handleToggleTheme = () => {
    const next = toggleTheme()
    setThemeState(next)
  }

  const themeColors = getThemeColors(theme)

  return (
    <div className="book-viewer-page" style={{ minHeight: '100vh', background: themeColors.container, color: themeColors.text, transition: 'background 0.3s, color 0.3s' }}>
      <Navbar />
      <div className="container mt-3" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button
          type="button"
          className={isFavorite ? 'btn btn-warning btn-sm' : 'btn btn-outline-warning btn-sm'}
          onClick={handleToggleFavorite}
        >
          {isFavorite ? '★ Favorited' : '☆ Add to Favorites'}
        </button>
        <button
          type="button"
          className={theme === 'dark' ? 'btn btn-dark btn-sm' : 'btn btn-light btn-sm'}
          onClick={handleToggleTheme}
          style={{ border: '1px solid #667eea' }}
        >
          {theme === 'dark' ? '🌙 Night Mode' : '☀️ Day Mode'}
        </button>
      </div>
      {hasPdf ? (
        fileStatus === 'checking' ? (
          <div className="container mt-4" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h4 style={{ color: '#667eea', marginBottom: '8px' }}>Loading book...</h4>
            <p style={{ color: themeColors.text, opacity: 0.7, margin: 0 }}>Please wait while we prepare the file.</p>
          </div>
        ) : fileStatus === 'ready' && isPdfFile ? (
          <div className="book-frame-wrap" style={{ width: '100%', height: 'calc(100dvh - 72px)', overflow: 'hidden' }}>
            <iframe
              src={encodedBookPath}
              className="book-frame"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title={title}
            ></iframe>
          </div>
        ) : fileStatus === 'ready' ? (
          <div className="container mt-4">
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: themeColors.text }}>
              {title}
            </h2>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: themeColors.text, opacity: 0.7 }}>
              This file format may not render inside the app viewer.
            </p>
            <div style={{ textAlign: 'center', padding: '40px 20px', background: themeColors.panelBg, borderRadius: '12px', border: `1px solid ${themeColors.panelBorder}` }}>
              <a
                href={encodedBookPath}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', background: '#667eea', color: '#fff', padding: '12px 18px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}
              >
                Open Book File
              </a>
            </div>
            <Footer />
          </div>
        ) : (
          <div className="container mt-4">
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: themeColors.text }}>
              {title}
            </h2>
            <div style={{ textAlign: 'center', padding: '60px 20px', background: themeColors.panelBg, borderRadius: '12px', border: `1px solid ${themeColors.panelBorder}` }}>
              <h4 style={{ color: '#667eea', marginBottom: '10px' }}>File Not Found</h4>
              <p style={{ color: themeColors.text, margin: 0, opacity: 0.7 }}>
                The file path for this book does not match a file in the books folder.
              </p>
            </div>
            <Footer />
          </div>
        )
      ) : (
        <div className="container mt-4">
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: themeColors.text }}>
            {title}
          </h2>
          {description && (
            <p style={{ textAlign: 'center', marginBottom: '20px', color: themeColors.text, opacity: 0.7 }}>
              {description}
            </p>
          )}
          <div style={{ textAlign: 'center', padding: '60px 20px', background: themeColors.panelBg, borderRadius: '12px', border: `1px solid ${themeColors.panelBorder}` }}>
            {coverImage && (
              <img src={coverImage} alt={title} style={{ width: '200px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', marginBottom: '20px' }} />
            )}
            <h4 style={{ color: '#667eea', marginBottom: '10px' }}>PDF Coming Soon</h4>
            <p style={{ color: themeColors.text, opacity: 0.7 }}>The PDF for this book is not yet available.<br />Please check back later or contact the admin.</p>
          </div>
          <Footer />
        </div>
      )}
    </div>
  )
}

export default BookViewer
