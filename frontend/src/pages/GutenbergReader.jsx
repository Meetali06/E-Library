import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { addBookToHistory } from '../utils/historyStorage'
import { isBookFavorite, toggleBookFavorite } from '../utils/favoritesStorage'
import { getCurrentTheme, getThemeColors, setTheme, toggleTheme } from '../utils/themeStorage'

function GutenbergReader() {
  const { id: encodedId } = useParams()
  const location = useLocation()
  const { title, author, readUrl, img } = location.state || {}
  const id = encodedId ? decodeURIComponent(encodedId) : ''
  const readerUrl = readUrl || `https://www.gutenberg.org/files/${id}/${id}-h/${id}-h.htm`

  const iframeRef = useRef(null)
  const canvasRef = useRef(null)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [drawMode, setDrawMode] = useState(false)
  const [highlightMode, setHighlightMode] = useState(false)
  const [highlightColor, setHighlightColor] = useState('rgba(255,235,59,0.3)')
  const [showContents, setShowContents] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [readerBg, setReaderBg] = useState('#525659')
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawColor, setDrawColor] = useState('#ff4444')
  const [drawWidth, setDrawWidth] = useState(3)
  const [isFavorite, setIsFavorite] = useState(false)
  const [theme, setThemeState] = useState(getCurrentTheme())

  const bookTitle = title || `Book #${id}`
  const bookPath = encodedId ? `/book/gutenberg/${encodedId}` : '/book/gutenberg'

  const favoritePayload = {
    title: bookTitle,
    author: author || '',
    description: author ? `by ${author}` : 'Project Gutenberg book',
    path: bookPath,
    readUrl: readerUrl,
    img: img || '',
    source: 'gutenberg'
  }

  useEffect(() => {
    addBookToHistory({
      title: bookTitle,
      description: author ? `by ${author}` : 'Project Gutenberg book',
      path: bookPath,
      source: 'gutenberg'
    })
  }, [bookTitle, author, bookPath])

  useEffect(() => {
    setIsFavorite(isBookFavorite(favoritePayload))
  }, [bookTitle, author, bookPath, readerUrl, img])

  // Zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 15, 200))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 15, 40))
  const handleFitPage = () => setZoom(100)

  // Rotate
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)

  // Fullscreen
  const handleFullscreen = useCallback(() => {
    const el = document.getElementById('reader-container')
    if (!document.fullscreenElement) {
      el?.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  // Print
  const handlePrint = () => {
    try { iframeRef.current?.contentWindow?.print() } catch { window.print() }
  }

  // Download
  const handleDownload = () => {
    const extension = readerUrl.toLowerCase().includes('.pdf') ? '.pdf' : '.html'
    const safeName = (bookTitle || 'book').replace(/[^a-z0-9\-_. ]/gi, '').trim() || 'book'
    const fileName = safeName.toLowerCase().endsWith(extension) ? safeName : `${safeName}${extension}`
    const downloadUrl = `/api/books/external-download?url=${encodeURIComponent(readerUrl)}&filename=${encodeURIComponent(fileName)}`

    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Open in new tab
  const handleOpenNewTab = () => {
    window.open(readerUrl, '_blank', 'noopener,noreferrer')
  }

  // Search in page
  const handleSearch = () => {
    if (searchText) {
      try {
        const iframeWin = iframeRef.current?.contentWindow
        if (iframeWin) {
          iframeWin.find(searchText, false, false, true)
        }
      } catch {
        // Cross-origin: fallback to browser find
        window.find(searchText)
      }
    }
  }

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const container = canvas.parentElement
    canvas.width = container.offsetWidth
    canvas.height = container.offsetHeight
  }, [drawMode, zoom, rotation])

  const getCanvasPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDraw = (e) => {
    if (!drawMode && !highlightMode) return
    setIsDrawing(true)
    const ctx = canvasRef.current.getContext('2d')
    const pos = getCanvasPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const ctx = canvasRef.current.getContext('2d')
    const pos = getCanvasPos(e)
    ctx.lineTo(pos.x, pos.y)
    if (highlightMode) {
      ctx.strokeStyle = highlightColor
      ctx.lineWidth = 20
      ctx.globalAlpha = 0.3
    } else {
      ctx.strokeStyle = drawColor
      ctx.lineWidth = drawWidth
      ctx.globalAlpha = 1
    }
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  const stopDraw = () => {
    setIsDrawing(false)
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) { ctx.globalAlpha = 1; ctx.closePath() }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const handleToggleFavorite = () => {
    const next = toggleBookFavorite(favoritePayload)
    setIsFavorite(next)
  }

  const handleToggleTheme = () => {
    const next = toggleTheme()
    setThemeState(next)
  }

  const activeStyle = (active) => ({
    background: active ? '#667eea' : 'transparent',
    color: active ? '#fff' : '#ccc',
  })

  const themeColors = getThemeColors(theme)

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>{bookTitle}</h2>
        {author && <p style={{ textAlign: 'center', marginBottom: '15px', color: '#555' }}>by {author}</p>}

        <div id="reader-container" style={{ borderRadius: '10px', border: '1px solid #333', background: themeColors.container, position: 'relative' }}>
          {/* Toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: themeColors.toolbar,
            padding: '6px 12px', gap: '4px', flexWrap: 'wrap', borderBottom: `1px solid ${themeColors.toolbarBorder}`,
            position: 'relative', zIndex: 20
          }}>
            {/* Left group */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>
              <ToolBtn icon="📑" tip="Table of Contents" onClick={() => { setShowContents(!showContents); setShowSettings(false); setShowSearch(false) }} extraStyle={activeStyle(showContents)} />
              <Divider />
              <ToolBtn icon="✏️" tip="Draw" onClick={() => { setDrawMode(!drawMode); setHighlightMode(false) }} extraStyle={activeStyle(drawMode)} />
              {drawMode && (
                <>
                  <input type="color" value={drawColor} onChange={e => setDrawColor(e.target.value)} title="Pen Color" style={{ width: 24, height: 24, border: 'none', cursor: 'pointer', borderRadius: 4 }} />
                  <select value={drawWidth} onChange={e => setDrawWidth(Number(e.target.value))} title="Pen Width" style={{ background: '#333', color: '#ccc', border: '1px solid #555', borderRadius: 4, fontSize: 12, padding: '2px 4px' }}>
                    <option value={2}>Thin</option>
                    <option value={3}>Medium</option>
                    <option value={5}>Thick</option>
                    <option value={8}>Bold</option>
                  </select>
                  <ToolBtn icon="🗑" tip="Clear Drawing" onClick={clearCanvas} />
                </>
              )}
              <ToolBtn icon="🖍" tip="Highlight" onClick={() => { setHighlightMode(!highlightMode); setDrawMode(false) }} extraStyle={activeStyle(highlightMode)} />
              {highlightMode && (
                <>
                  <HighlightColorBtn color="rgba(255,235,59,0.5)" current={highlightColor} onClick={setHighlightColor} label="Yellow" />
                  <HighlightColorBtn color="rgba(76,175,80,0.4)" current={highlightColor} onClick={setHighlightColor} label="Green" />
                  <HighlightColorBtn color="rgba(33,150,243,0.4)" current={highlightColor} onClick={setHighlightColor} label="Blue" />
                  <HighlightColorBtn color="rgba(244,67,54,0.35)" current={highlightColor} onClick={setHighlightColor} label="Red" />
                  <ToolBtn icon="🗑" tip="Clear Highlights" onClick={clearCanvas} />
                </>
              )}
              <Divider />
              <ToolBtn icon="🔗" tip="Copy Link" onClick={() => { navigator.clipboard?.writeText(readerUrl); alert('Link copied!') }} />
            </div>

            {/* Center group - Zoom & Rotate */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ToolBtn icon="−" tip="Zoom Out" onClick={handleZoomOut} />
              <ToolBtn icon="+" tip="Zoom In" onClick={handleZoomIn} />
              <ToolBtn icon="⊞" tip="Fit Page" onClick={handleFitPage} />
              <span style={{ color: '#aaa', fontSize: '12px', padding: '0 6px', minWidth: '40px', textAlign: 'center' }}>{zoom}%</span>
              <Divider />
              <ToolBtn icon="↻" tip="Rotate 90°" onClick={handleRotate} />
            </div>

            {/* Right group */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>
              <ToolBtn icon="🔍" tip="Search in Book" onClick={() => { setShowSearch(!showSearch); setShowContents(false); setShowSettings(false) }} extraStyle={activeStyle(showSearch)} />
              <Divider />
              <ToolBtn icon={isFavorite ? '★' : '☆'} tip={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'} onClick={handleToggleFavorite} extraStyle={activeStyle(isFavorite)} />
              <ToolBtn icon="🖨" tip="Print" onClick={handlePrint} />
              <ToolBtn icon="💾" tip="Download" onClick={handleDownload} />
              <Divider />
              <ToolBtn icon={isFullscreen ? '⊠' : '⛶'} tip="Fullscreen" onClick={handleFullscreen} />
              <ToolBtn icon="⚙" tip="Settings" onClick={() => { setShowSettings(!showSettings); setShowContents(false); setShowSearch(false) }} extraStyle={activeStyle(showSettings)} />
            </div>
          </div>

          {/* Panels - positioned relative to toolbar */}
          {showContents && (
            <Panel onClose={() => setShowContents(false)} title="Book Info" position="left" themeColors={themeColors}>
              {img && <img src={img} alt={bookTitle} style={{ width: 100, borderRadius: 6, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />}
              <p style={{ margin: '4px 0', color: themeColors.panelText }}><strong>Title:</strong> {bookTitle}</p>
              {author && <p style={{ margin: '4px 0', color: themeColors.panelText }}><strong>Author:</strong> {author}</p>}
              <p style={{ margin: '4px 0', color: themeColors.panelText }}><strong>Source:</strong> Project Gutenberg</p>
              <PanelBtn label="View on Gutenberg ↗" onClick={() => window.open(`https://www.gutenberg.org/ebooks/${id}`, '_blank')} themeColors={themeColors} />
              <PanelBtn label="Open HTML Version ↗" onClick={() => window.open(readerUrl, '_blank')} themeColors={themeColors} />
            </Panel>
          )}

          {showSearch && (
            <Panel onClose={() => setShowSearch(false)} title="Search in Book" position="right" themeColors={themeColors}>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text" placeholder="Search text..." value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: `1px solid ${themeColors.panelBorder}`, background: themeColors.panelBg, color: themeColors.panelText, fontSize: 14 }}
                  autoFocus
                />
                <PanelBtn label="Find" onClick={handleSearch} inline themeColors={themeColors} />
              </div>
              <p style={{ fontSize: 11, color: '#888', marginTop: 6 }}>Tip: Use Ctrl+F for browser search if this doesn't work cross-origin.</p>
            </Panel>
          )}

          {showSettings && (
            <Panel onClose={() => setShowSettings(false)} title="Settings" position="right" themeColors={themeColors}>
              <p style={{ margin: '4px 0', fontWeight: 600, fontSize: 13, color: themeColors.panelText }}>Background</p>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                {[{ c: '#525659', l: 'Dark Gray' }, { c: '#1a1a2e', l: 'Navy' }, { c: '#f5f0e1', l: 'Sepia' }, { c: '#ffffff', l: 'White' }, { c: '#2d2d2d', l: 'Charcoal' }].map(({ c, l }) => (
                  <div key={c} title={l} onClick={() => setReaderBg(c)} style={{
                    width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                    border: readerBg === c ? '3px solid #667eea' : '2px solid #555',
                    transition: 'border 0.15s'
                  }} />
                ))}
              </div>
              <p style={{ margin: '8px 0 4px', fontWeight: 600, fontSize: 13, color: themeColors.panelText }}>Theme</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {['dark', 'light'].map(t => (
                  <button key={t} onClick={handleToggleTheme} style={{
                    flex: 1, padding: '7px 10px', borderRadius: 6,
                    border: theme === t ? '2px solid #667eea' : `1px solid ${themeColors.panelBorder}`,
                    background: theme === t ? '#667eea' : themeColors.panelBg,
                    color: theme === t ? '#fff' : themeColors.panelText,
                    cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    transition: 'all 0.2s'
                  }}>
                    {t === 'dark' ? '🌙 Night' : '☀️ Day'}
                  </button>
                ))}
              </div>
              <p style={{ margin: '8px 0 4px', fontWeight: 600, fontSize: 13, color: themeColors.panelText }}>Actions</p>
              <PanelBtn label="Open in New Tab ↗" onClick={handleOpenNewTab} themeColors={themeColors} />
              <PanelBtn label="Print Book 🖨" onClick={handlePrint} themeColors={themeColors} />
              <PanelBtn label="Download Book 💾" onClick={handleDownload} themeColors={themeColors} />
              <PanelBtn label="Reset All ↺" onClick={() => { setRotation(0); setZoom(100); setReaderBg('#525659'); clearCanvas() }} themeColors={themeColors} />
            </Panel>
          )}

          {/* Reader area */}
          <div style={{
            width: '100%', height: isFullscreen ? 'calc(100vh - 50px)' : '800px',
            overflow: 'auto', background: readerBg, position: 'relative',
            padding: '16px', boxSizing: 'border-box',
            borderRadius: '0 0 10px 10px', color: themeColors.text
          }}>
            {/* Canvas overlay for draw/highlight */}
            {(drawMode || highlightMode) && (
              <canvas
                ref={canvasRef}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  zIndex: 10, cursor: drawMode ? 'crosshair' : 'pointer',
                }}
              />
            )}
            <iframe
              ref={iframeRef}
              src={readerUrl}
              style={{
                width: `${zoom}%`, minHeight: 'calc(100% - 32px)', border: 'none',
                display: 'block', margin: '0 auto', background: '#fff',
                boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease',
              }}
              title={bookTitle}
              sandbox="allow-same-origin allow-scripts allow-popups"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

const panelBtnStyle = {
  display: 'block', width: '100%', padding: '7px 12px', margin: '6px 0', borderRadius: 6,
  border: '1px solid #555', background: '#333', color: '#ddd', cursor: 'pointer', fontSize: 13,
  textAlign: 'left', transition: 'background 0.15s',
}

function PanelBtn({ label, onClick, inline, themeColors }) {
  const colors = themeColors || { panelBorder: '#555', panelBg: '#333', panelText: '#ddd' }
  return (
    <button
      onClick={onClick}
      style={{
        display: inline ? 'inline-block' : 'block',
        width: inline ? 'auto' : '100%',
        padding: inline ? '6px 14px' : '7px 12px',
        margin: inline ? 0 : '6px 0',
        borderRadius: 6,
        border: `1px solid ${colors.panelBorder}`,
        background: colors.panelBg,
        color: colors.panelText,
        cursor: 'pointer',
        fontSize: 13,
        textAlign: 'left',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#667eea'; e.currentTarget.style.borderColor = '#667eea'; e.currentTarget.style.color = '#fff' }}
      onMouseLeave={e => { e.currentTarget.style.background = colors.panelBg; e.currentTarget.style.borderColor = colors.panelBorder; e.currentTarget.style.color = colors.panelText }}
    >
      {label}
    </button>
  )
}

function Panel({ children, onClose, title, position = 'left', themeColors }) {
  const colors = themeColors || { panelBg: '#1e1e2f', panelBorder: '#444', panelText: '#ddd' }
  const posStyle = position === 'right' ? { right: 10, left: 'auto' } : { left: 10, right: 'auto' }
  return (
    <div style={{
      position: 'absolute', top: 44, zIndex: 30, width: 280,
      background: colors.panelBg, borderRadius: 10, border: `1px solid ${colors.panelBorder}`,
      boxShadow: '0 8px 30px rgba(0,0,0,0.5)', padding: '14px 16px', color: colors.panelText,
      ...posStyle
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <strong style={{ fontSize: 14 }}>{title}</strong>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 18 }}>✕</button>
      </div>
      {children}
    </div>
  )
}

function ToolBtn({ icon, tip, onClick, extraStyle = {} }) {
  return (
    <button
      title={tip}
      onClick={onClick}
      style={{
        background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer',
        fontSize: '16px', padding: '5px 8px', borderRadius: '4px', lineHeight: 1,
        transition: 'background 0.15s, color 0.15s', ...extraStyle,
      }}
      onMouseEnter={e => { if (!extraStyle.background) { e.currentTarget.style.background = '#444'; e.currentTarget.style.color = '#fff' } }}
      onMouseLeave={e => { e.currentTarget.style.background = extraStyle.background || 'transparent'; e.currentTarget.style.color = extraStyle.color || '#ccc' }}
    >
      {icon}
    </button>
  )
}

function HighlightColorBtn({ color, current, onClick, label }) {
  return (
    <div
      title={label}
      onClick={() => onClick(color)}
      style={{
        width: 20, height: 20, borderRadius: '50%', background: color, cursor: 'pointer',
        border: current === color ? '2px solid #fff' : '2px solid #555',
      }}
    />
  )
}

function Divider() {
  return <span style={{ width: '1px', height: '20px', background: '#555', margin: '0 4px' }} />
}

export default GutenbergReader
