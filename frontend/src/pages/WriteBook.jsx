import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ── toolbar button default style ──────────────────────────────────────────────
const toolBtn = {
  background: '#1e2a45',
  color: '#dce3f0',
  border: '1px solid #3a4a6b',
  borderRadius: '5px',
  padding: '4px 10px',
  cursor: 'pointer',
  fontSize: '0.82rem',
  minWidth: '32px',
  transition: 'background 0.15s',
  lineHeight: '1.4',
}

const divider = (
  <div style={{ width: '1px', height: '26px', background: '#3a4a6b', margin: '0 4px', flexShrink: 0 }} />
)

// ── main component ─────────────────────────────────────────────────────────────
function WriteBook() {
  const navigate = useNavigate()

  const [bookTitle, setBookTitle] = useState('My Book Title')
  const [authorName, setAuthorName] = useState('')
  const [genre, setGenre] = useState('')
  const [chapters, setChapters] = useState([{ id: 1, title: 'Chapter 1', content: '' }])
  const [activeChapter, setActiveChapter] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [saved, setSaved] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showMetaModal, setShowMetaModal] = useState(false)

  const editorRef = useRef(null)
  const chaptersRef = useRef(chapters)

  // keep ref in sync
  useEffect(() => { chaptersRef.current = chapters }, [chapters])

  // ── format commands ──────────────────────────────────────────────────────────
  const execFormat = (cmd, value = null) => {
    document.execCommand(cmd, false, value)
    editorRef.current?.focus()
  }

  // ── sync editor → state ──────────────────────────────────────────────────────
  const syncContent = useCallback(() => {
    if (!editorRef.current) return
    const html = editorRef.current.innerHTML
    const text = editorRef.current.innerText || ''
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(w => w).length
    setWordCount(words)
    setCharCount(text.replace(/\n/g, '').length)
    setChapters(prev => {
      const updated = [...prev]
      updated[activeChapter] = { ...updated[activeChapter], content: html }
      return updated
    })
  }, [activeChapter])

  // ── load chapter into editor when switching ──────────────────────────────────
  const switchChapter = useCallback((index) => {
    // save current before switching
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      setChapters(prev => {
        const updated = [...prev]
        updated[activeChapter] = { ...updated[activeChapter], content: html }
        return updated
      })
    }
    setActiveChapter(index)
  }, [activeChapter])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = chapters[activeChapter]?.content || ''
      editorRef.current.focus()
      // recalculate counts
      const text = editorRef.current.innerText || ''
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(w => w).length
      setWordCount(words)
      setCharCount(text.replace(/\n/g, '').length)
    }
  }, [activeChapter]) // eslint-disable-line

  // ── add chapter ──────────────────────────────────────────────────────────────
  const addChapter = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      setChapters(prev => {
        const updated = [...prev]
        updated[activeChapter] = { ...updated[activeChapter], content: html }
        return [...updated, { id: Date.now(), title: `Chapter ${updated.length + 1}`, content: '' }]
      })
    }
    // switch to new chapter after state updates
    setTimeout(() => setActiveChapter(chaptersRef.current.length - 1), 0)
  }

  // ── delete chapter ───────────────────────────────────────────────────────────
  const deleteChapter = (e, index) => {
    e.stopPropagation()
    if (chapters.length === 1) return
    setChapters(prev => prev.filter((_, i) => i !== index))
    setActiveChapter(prev => Math.max(0, index === prev ? index - 1 : prev > index ? prev - 1 : prev))
  }

  // ── rename chapter ───────────────────────────────────────────────────────────
  const renameChapter = (index, title) => {
    setChapters(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], title }
      return updated
    })
  }

  // ── auto-save to localStorage ────────────────────────────────────────────────
  const saveToLocal = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      const text = editorRef.current.innerText || ''
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(w => w).length
      setWordCount(words)
      setCharCount(text.replace(/\n/g, '').length)
      
      const updated = [...chaptersRef.current]
      updated[activeChapter] = { ...updated[activeChapter], content: html }
      const data = { bookTitle, authorName, genre, chapters: updated }
      try {
        localStorage.setItem('writeBook_draft', JSON.stringify(data))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } catch (err) {
        console.error('Failed to save draft:', err)
      }
    }
  }

  // restore draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('writeBook_draft')
    if (draft) {
      try {
        const data = JSON.parse(draft)
        setBookTitle(data.bookTitle || 'My Book Title')
        setAuthorName(data.authorName || '')
        setGenre(data.genre || '')
        setChapters(data.chapters || [{ id: 1, title: 'Chapter 1', content: '' }])
        setActiveChapter(0)
      } catch (_) {}
    }
  }, [])

  // load first chapter content after potential draft restore
  useEffect(() => {
    if (editorRef.current && chapters[0]) {
      editorRef.current.innerHTML = chapters[0].content || ''
    }
  }, []) // eslint-disable-line

  // ── keyboard shortcuts ───────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); saveToLocal() }
      if (e.ctrlKey && e.key === 'b') { e.preventDefault(); execFormat('bold') }
      if (e.ctrlKey && e.key === 'i') { e.preventDefault(); execFormat('italic') }
      if (e.ctrlKey && e.key === 'u') { e.preventDefault(); execFormat('underline') }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, []) // eslint-disable-line

  // ── insert horizontal rule ───────────────────────────────────────────────────
  const insertHR = () => { execFormat('insertHorizontalRule') }

  // ── insert link ──────────────────────────────────────────────────────────────
  const insertLink = () => {
    const url = window.prompt('Enter URL:', 'https://')
    if (url) execFormat('createLink', url)
  }

  // ── download as TXT ──────────────────────────────────────────────────────────
  const downloadTXT = () => {
    saveToLocal()
    let text = `${bookTitle}\n`
    text += `By ${authorName || 'Unknown Author'}`
    if (genre) text += ` | ${genre}`
    text += `\n${'═'.repeat(50)}\n\n`
    chaptersRef.current.forEach((ch, i) => {
      text += `\n${ch.title || `Chapter ${i + 1}`}\n${'─'.repeat(40)}\n\n`
      const div = document.createElement('div')
      div.innerHTML = ch.content || ''
      text += (div.innerText || '') + '\n\n'
    })
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${bookTitle.replace(/[^a-z0-9]/gi, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── download as PDF (print dialog) ──────────────────────────────────────────
  const downloadPDF = () => {
    saveToLocal()
    const currentContent = editorRef.current?.innerHTML || ''
    const allChapters = [...chaptersRef.current]
    allChapters[activeChapter] = { ...allChapters[activeChapter], content: currentContent }

    const win = window.open('', '_blank', 'width=900,height=700')
    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <title>${bookTitle}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'EB Garamond', Georgia, serif; max-width: 700px; margin: 0 auto; padding: 60px 50px; color: #1a1a1a; line-height: 1.9; font-size: 13pt; }
      .cover { text-align: center; padding: 120px 0 80px; border-bottom: 3px double #333; margin-bottom: 60px; page-break-after: always; }
      .cover h1 { font-family: 'Cinzel', Georgia, serif; font-size: 2.8em; letter-spacing: 0.05em; margin-bottom: 0.4em; }
      .cover .by { font-size: 1.1em; color: #555; margin-top: 0.5em; }
      .cover .genre { font-size: 0.95em; color: #888; margin-top: 0.3em; font-style: italic; }
      .chapter { margin-bottom: 60px; page-break-before: always; }
      .chapter:first-of-type { page-break-before: avoid; }
      .chapter-title { font-family: 'Cinzel', Georgia, serif; font-size: 1.6em; border-bottom: 2px solid #333; padding-bottom: 0.4em; margin-bottom: 1.4em; color: #1a1a1a; }
      p { margin-bottom: 0.7em; text-indent: 1.5em; }
      h1, h2, h3 { margin: 0.8em 0 0.4em; font-family: 'Cinzel', Georgia, serif; text-indent: 0; }
      ul, ol { margin: 0.5em 0 0.5em 2em; }
      li { margin-bottom: 0.3em; }
      blockquote { border-left: 3px solid #888; padding-left: 1em; color: #555; font-style: italic; margin: 1em 0; }
      hr { border: none; border-top: 1px solid #ccc; margin: 1.5em 0; }
      @media print {
        body { padding: 0; }
        .chapter { page-break-before: always; }
      }
    </style></head><body>
    <div class="cover">
      <h1>${bookTitle}</h1>
      <p class="by">By ${authorName || 'Unknown Author'}</p>
      ${genre ? `<p class="genre">${genre}</p>` : ''}
    </div>`

    allChapters.forEach((ch, i) => {
      html += `<div class="chapter">
        <h2 class="chapter-title">${ch.title || `Chapter ${i + 1}`}</h2>
        <div>${ch.content || '<p><em>(This chapter is empty.)</em></p>'}</div>
      </div>`
    })

    html += `</body></html>`
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print() }, 600)
  }

  // ── clear draft ──────────────────────────────────────────────────────────────
  const newBook = () => {
    if (!window.confirm('Start a new book? Your current draft (if saved) will be cleared.')) return
    localStorage.removeItem('writeBook_draft')
    setBookTitle('My Book Title')
    setAuthorName('')
    setGenre('')
    setChapters([{ id: 1, title: 'Chapter 1', content: '' }])
    setActiveChapter(0)
    setTimeout(() => { if (editorRef.current) editorRef.current.innerHTML = '' }, 0)
  }

  // total word count across all chapters
  const totalWords = chapters.reduce((acc, ch, i) => {
    if (i === activeChapter) return acc + wordCount
    const div = document.createElement('div')
    div.innerHTML = ch.content || ''
    const t = div.innerText?.trim() || ''
    return acc + (t === '' ? 0 : t.split(/\s+/).filter(w => w).length)
  }, 0)

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      <div style={{ minHeight: '100vh', background: '#0d1117', color: '#c9d1d9', display: 'flex', flexDirection: 'column' }}>

        {/* ── Top header bar ── */}
        <div style={{
          background: 'linear-gradient(135deg, #161b22 0%, #1a2332 100%)',
          padding: '0.7rem 1.2rem',
          borderBottom: '2px solid #e94560',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          boxShadow: '0 2px 12px rgba(233,69,96,0.15)',
        }}>
          {/* Sidebar toggle */}
          <button onClick={() => setSidebarOpen(o => !o)} title="Toggle chapters" style={{ ...toolBtn, fontSize: '1rem', padding: '4px 10px' }}>
            ☰
          </button>

          {/* Editable book title */}
          <input
            value={bookTitle}
            onChange={e => setBookTitle(e.target.value)}
            title="Book Title"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '2px solid #e94560',
              color: '#fff',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              outline: 'none',
              minWidth: '180px',
              maxWidth: '320px',
              fontFamily: 'Georgia, serif',
              letterSpacing: '0.03em',
            }}
          />

          {/* Meta button */}
          <button
            onClick={() => setShowMetaModal(true)}
            style={{ ...toolBtn, fontSize: '0.82rem', padding: '4px 12px', border: '1px solid #e94560', color: '#e94560' }}
          >
            ✏ Book Info
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {saved && <span style={{ color: '#3fb950', fontSize: '0.82rem' }}>✓ Saved</span>}
            <button onClick={saveToLocal} style={{ ...toolBtn, border: '1px solid #3fb950', color: '#3fb950' }}>
              💾 Save Draft
            </button>
            <button onClick={() => navigate('/my-drafts')} style={{ ...toolBtn, border: '1px solid #58a6ff', color: '#58a6ff' }}>
              📂 View Drafts
            </button>
            <button onClick={newBook} style={{ ...toolBtn }}>
              📄 New Book
            </button>
            <button onClick={downloadTXT} style={{ ...toolBtn, border: '1px solid #58a6ff', color: '#58a6ff' }}>
              ⬇ Download TXT
            </button>
            <button onClick={downloadPDF} style={{ ...toolBtn, background: '#e94560', color: '#fff', border: 'none', fontWeight: 'bold' }}>
              📄 Download PDF
            </button>
          </div>
        </div>

        {/* ── Main body ── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

          {/* ── Chapters Sidebar ── */}
          {sidebarOpen && (
            <div style={{
              width: '220px',
              background: '#161b22',
              borderRight: '1px solid #30363d',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
            }}>
              <div style={{ padding: '0.9rem 0.8rem 0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#e94560', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Chapters</span>
                <button
                  onClick={addChapter}
                  title="Add chapter"
                  style={{ background: '#e94560', color: '#fff', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontSize: '1.1rem', lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >+</button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.5rem 1rem' }}>
                {chapters.map((ch, index) => (
                  <div
                    key={ch.id}
                    onClick={() => switchChapter(index)}
                    style={{
                      padding: '0.5rem 0.6rem',
                      marginBottom: '0.3rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: activeChapter === index
                        ? 'linear-gradient(135deg, #e94560 0%, #c73652 100%)'
                        : '#1e2939',
                      color: activeChapter === index ? '#fff' : '#c9d1d9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '4px',
                      border: activeChapter === index ? '1px solid #e94560' : '1px solid transparent',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {ch.title || `Chapter ${index + 1}`}
                    </span>
                    {chapters.length > 1 && (
                      <span
                        onClick={(e) => deleteChapter(e, index)}
                        title="Delete chapter"
                        style={{ color: activeChapter === index ? '#ffd0d8' : '#8b949e', cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0, padding: '0 2px' }}
                      >✕</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Word count summary */}
              <div style={{ padding: '0.6rem 0.8rem', borderTop: '1px solid #30363d', fontSize: '0.75rem', color: '#8b949e' }}>
                <div>📖 {chapters.length} chapter{chapters.length !== 1 ? 's' : ''}</div>
                <div>📝 ~{totalWords.toLocaleString()} words total</div>
              </div>
            </div>
          )}

          {/* ── Editor Column ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

            {/* ── Formatting Toolbar ── */}
            <div style={{
              background: '#161b22',
              padding: '0.45rem 1rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '3px',
              borderBottom: '1px solid #30363d',
              alignItems: 'center',
            }}>
              {/* Chapter title input */}
              <input
                value={chapters[activeChapter]?.title || ''}
                onChange={e => renameChapter(activeChapter, e.target.value)}
                placeholder="Chapter Title"
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #e94560',
                  color: '#e0e6f0',
                  fontSize: '0.88rem',
                  outline: 'none',
                  width: '160px',
                  marginRight: '8px',
                  fontWeight: 600,
                }}
              />
              {divider}

              {/* Text style buttons */}
              <button onMouseDown={e => { e.preventDefault(); execFormat('bold') }} title="Bold (Ctrl+B)" style={toolBtn}><strong>B</strong></button>
              <button onMouseDown={e => { e.preventDefault(); execFormat('italic') }} title="Italic (Ctrl+I)" style={{ ...toolBtn, fontStyle: 'italic' }}>I</button>
              <button onMouseDown={e => { e.preventDefault(); execFormat('underline') }} title="Underline (Ctrl+U)" style={{ ...toolBtn, textDecoration: 'underline' }}>U</button>
              <button onMouseDown={e => { e.preventDefault(); execFormat('strikeThrough') }} title="Strikethrough" style={{ ...toolBtn, textDecoration: 'line-through' }}>S</button>
              {divider}

              {/* Headings */}
              <button onMouseDown={e => { e.preventDefault(); execFormat('formatBlock', 'H1') }} title="Heading 1" style={{ ...toolBtn, fontWeight: 700, fontSize: '0.9rem' }}>H1</button>
              <button onMouseDown={e => { e.preventDefault(); execFormat('formatBlock', 'H2') }} title="Heading 2" style={{ ...toolBtn, fontWeight: 700 }}>H2</button>
              <button onMouseDown={e => { e.preventDefault(); execFormat('formatBlock', 'H3') }} title="Heading 3" style={{ ...toolBtn, fontWeight: 700 }}>H3</button>
              <button onMouseDown={e => { e.preventDefault(); execFormat('formatBlock', 'P') }} title="Paragraph" style={toolBtn}>¶</button>
              <button onMouseDown={e => { e.preventDefault(); execFormat('formatBlock', 'BLOCKQUOTE') }} title="Blockquote" style={{ ...toolBtn, fontStyle: 'italic' }}>"</button>
              {divider}

              {/* Lists */}
              <button onMouseDown={e => { e.preventDefault(); execFormat('insertUnorderedList') }} title="Bullet List" style={toolBtn}>• List</button>
              <button onMouseDown={e => { e.preventDefault(); execFormat('insertOrderedList') }} title="Numbered List" style={toolBtn}>1. List</button>
              {divider}

              {/* Align */}
              <button onMouseDown={e => { e.preventDefault(); execFormat('justifyLeft') }} title="Align Left" style={toolBtn}>⬅</button>
              <button onMouseDown={e => { e.preventDefault(); execFormat('justifyCenter') }} title="Center" style={toolBtn}>↔</button>
              <button onMouseDown={e => { e.preventDefault(); execFormat('justifyRight') }} title="Align Right" style={toolBtn}>➡</button>
              <button onMouseDown={e => { e.preventDefault(); execFormat('justifyFull') }} title="Justify" style={toolBtn}>☰</button>
              {divider}

              {/* Indent */}
              <button onMouseDown={e => { e.preventDefault(); execFormat('indent') }} title="Indent" style={toolBtn}>→</button>
              <button onMouseDown={e => { e.preventDefault(); execFormat('outdent') }} title="Outdent" style={toolBtn}>←</button>
              {divider}

              {/* Font size */}
              <select
                onMouseDown={e => e.stopPropagation()}
                onChange={e => { execFormat('fontSize', e.target.value); e.target.value = '' }}
                defaultValue=""
                title="Font Size"
                style={{ background: '#1e2939', color: '#c9d1d9', border: '1px solid #3a4a6b', borderRadius: '5px', padding: '3px 4px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                <option value="" disabled>Size</option>
                <option value="1">8pt</option>
                <option value="2">10pt</option>
                <option value="3">12pt</option>
                <option value="4">14pt</option>
                <option value="5">18pt</option>
                <option value="6">24pt</option>
                <option value="7">36pt</option>
              </select>

              {/* Font family */}
              <select
                onMouseDown={e => e.stopPropagation()}
                onChange={e => { execFormat('fontName', e.target.value); e.target.value = '' }}
                defaultValue=""
                title="Font"
                style={{ background: '#1e2939', color: '#c9d1d9', border: '1px solid #3a4a6b', borderRadius: '5px', padding: '3px 4px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                <option value="" disabled>Font</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Courier New">Courier New</option>
                <option value="Palatino">Palatino</option>
                <option value="Garamond">Garamond</option>
              </select>
              {divider}

              {/* Colors */}
              <label title="Text Color" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.8rem', color: '#c9d1d9' }}>
                A
                <input type="color" defaultValue="#000000"
                  onInput={e => execFormat('foreColor', e.target.value)}
                  style={{ width: '22px', height: '22px', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                />
              </label>
              <label title="Highlight Color" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.8rem', color: '#c9d1d9' }}>
                🖍
                <input type="color" defaultValue="#ffff00"
                  onInput={e => execFormat('hiliteColor', e.target.value)}
                  style={{ width: '22px', height: '22px', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                />
              </label>
              {divider}

              {/* Extra */}
              <button onMouseDown={e => { e.preventDefault(); insertLink() }} title="Insert Link" style={toolBtn}>🔗</button>
              <button onMouseDown={e => { e.preventDefault(); insertHR() }} title="Horizontal Rule" style={toolBtn}>—</button>
              <button onMouseDown={e => { e.preventDefault(); execFormat('removeFormat') }} title="Clear Formatting" style={toolBtn}>✕ Format</button>
            </div>

            {/* ── Paper Editor ── */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#0d1117', padding: '2rem 1rem' }}>
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={syncContent}
                spellCheck
                data-placeholder="Start writing your story here..."
                style={{
                  minHeight: '100%',
                  maxWidth: '780px',
                  margin: '0 auto',
                  background: '#fff',
                  color: '#1a1a1a',
                  padding: '56px 70px',
                  borderRadius: '4px',
                  outline: 'none',
                  fontSize: '13pt',
                  lineHeight: '1.9',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
                  caretColor: '#e94560',
                }}
              />
            </div>

            {/* ── Status Bar ── */}
            <div style={{
              background: '#161b22',
              borderTop: '1px solid #30363d',
              padding: '0.3rem 1.2rem',
              display: 'flex',
              gap: '2rem',
              fontSize: '0.78rem',
              color: '#8b949e',
              alignItems: 'center',
            }}>
              <span>Chapter {activeChapter + 1} of {chapters.length}</span>
              <span>{wordCount.toLocaleString()} words</span>
              <span>{charCount.toLocaleString()} characters</span>
              <span style={{ marginLeft: 'auto', color: '#58a6ff' }}>Ctrl+S to save · Ctrl+B Bold · Ctrl+I Italic</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Book Info Modal ── */}
      {showMetaModal && (
        <div
          onClick={() => setShowMetaModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '2rem', width: '420px', color: '#c9d1d9', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
          >
            <h5 style={{ color: '#e94560', marginBottom: '1.2rem', fontSize: '1.1rem' }}>📚 Book Information</h5>

            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#8b949e' }}>Book Title</label>
            <input
              value={bookTitle}
              onChange={e => setBookTitle(e.target.value)}
              style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '0.5rem 0.75rem', color: '#fff', marginBottom: '1rem', outline: 'none', fontSize: '1rem' }}
            />

            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#8b949e' }}>Author Name</label>
            <input
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              placeholder="Your name"
              style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '0.5rem 0.75rem', color: '#fff', marginBottom: '1rem', outline: 'none' }}
            />

            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#8b949e' }}>Genre</label>
            <select
              value={genre}
              onChange={e => setGenre(e.target.value)}
              style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '0.5rem 0.75rem', color: '#fff', marginBottom: '1.5rem', outline: 'none' }}
            >
              <option value="">Select genre (optional)</option>
              <option>Fiction</option>
              <option>Non-Fiction</option>
              <option>Mystery & Thriller</option>
              <option>Romance</option>
              <option>Science Fiction</option>
              <option>Fantasy</option>
              <option>Biography</option>
              <option>Self-Help</option>
              <option>Horror</option>
              <option>Poetry</option>
              <option>History</option>
              <option>Children's Book</option>
              <option>Adventure</option>
              <option>Other</option>
            </select>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowMetaModal(false)} style={{ ...toolBtn, padding: '0.4rem 1rem' }}>Cancel</button>
              <button
                onClick={() => { saveToLocal(); setShowMetaModal(false) }}
                style={{ background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 1.2rem', cursor: 'pointer', fontWeight: 600 }}
              >Save</button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for placeholder */}
      <style>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #aaa;
          pointer-events: none;
          font-style: italic;
        }
      `}</style>

      <Footer />
    </>
  )
}

export default WriteBook
