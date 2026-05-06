import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function MyDrafts() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const savedDraft = localStorage.getItem('writeBook_draft')
    if (savedDraft) {
      try {
        const data = JSON.parse(savedDraft)
        setDraft(data)
      } catch (_) {
        setDraft(null)
      }
    }
    setLoading(false)
  }, [])

  const handleEditDraft = () => {
    navigate('/write-book')
  }

  const handleDeleteDraft = () => {
    localStorage.removeItem('writeBook_draft')
    setDraft(null)
    setShowDeleteConfirm(false)
  }

  const getTotalWords = () => {
    if (!draft || !draft.chapters) return 0
    return draft.chapters.reduce((total, ch) => {
      const div = document.createElement('div')
      div.innerHTML = ch.content || ''
      const text = div.innerText || ''
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(w => w).length
      return total + words
    }, 0)
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#888' }}>Loading drafts...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Navbar />

      <div style={{
        minHeight: 'calc(100vh - 200px)',
        background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
        padding: '40px 20px',
        color: '#c9d1d9'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '10px',
            background: 'linear-gradient(90deg, #e94560, #58a6ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px'
          }}>
            📚 My Drafts
          </h1>
          <p style={{ color: '#8b949e', marginBottom: '40px', fontSize: '1rem' }}>
            View and manage your saved book drafts
          </p>

          {!draft ? (
            <div style={{
              background: '#161b22',
              border: '2px dashed #30363d',
              borderRadius: '12px',
              padding: '60px 40px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📝</div>
              <h3 style={{ color: '#c9d1d9', marginBottom: '10px', fontSize: '1.3rem' }}>No Drafts Yet</h3>
              <p style={{ color: '#8b949e', marginBottom: '30px' }}>
                Start writing your own book and save drafts to see them here.
              </p>
              <button
                onClick={() => navigate('/write-book')}
                style={{
                  background: '#e94560',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={e => e.target.style.background = '#d63350'}
                onMouseLeave={e => e.target.style.background = '#e94560'}
              >
                ✍️ Start Writing
              </button>
            </div>
          ) : (
            <div style={{
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
            }}>
              {/* Draft Header */}
              <div style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                padding: '30px',
                borderBottom: '1px solid #30363d'
              }}>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: '#e94560',
                  marginBottom: '8px',
                  wordBreak: 'break-word'
                }}>
                  {draft.bookTitle || 'Untitled Book'}
                </h2>
                {draft.authorName && (
                  <p style={{ color: '#8b949e', fontSize: '1rem', marginBottom: '12px' }}>
                    by <strong>{draft.authorName}</strong>
                  </p>
                )}
                {draft.genre && (
                  <p style={{ color: '#58a6ff', fontSize: '0.95rem' }}>
                    Genre: {draft.genre}
                  </p>
                )}
              </div>

              {/* Draft Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                padding: '30px',
                background: '#161b22',
                borderBottom: '1px solid #30363d'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3fb950' }}>
                    {draft.chapters?.length || 0}
                  </div>
                  <div style={{ color: '#8b949e', fontSize: '0.9rem', marginTop: '5px' }}>
                    Chapters
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#58a6ff' }}>
                    ~{getTotalWords().toLocaleString()}
                  </div>
                  <div style={{ color: '#8b949e', fontSize: '0.9rem', marginTop: '5px' }}>
                    Words
                  </div>
                </div>
              </div>

              {/* Chapters List */}
              <div style={{ padding: '30px' }}>
                <h3 style={{ color: '#c9d1d9', marginBottom: '20px', fontSize: '1.1rem' }}>
                  Chapters
                </h3>
                <div style={{ display: 'grid', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                  {draft.chapters && draft.chapters.length > 0 ? (
                    draft.chapters.map((ch, i) => {
                      const div = document.createElement('div')
                      div.innerHTML = ch.content || ''
                      const preview = div.innerText?.substring(0, 100) || '(empty chapter)'
                      const words = div.innerText ? div.innerText.trim().split(/\s+/).filter(w => w).length : 0

                      return (
                        <div
                          key={i}
                          style={{
                            background: '#0d1117',
                            border: '1px solid #30363d',
                            borderRadius: '8px',
                            padding: '15px',
                            cursor: 'default',
                            transition: 'border-color 0.3s'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                            <h4 style={{ color: '#58a6ff', margin: 0 }}>
                              {ch.title || `Chapter ${i + 1}`}
                            </h4>
                            <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>
                              {words.toLocaleString()} words
                            </span>
                          </div>
                          <p style={{
                            color: '#8b949e',
                            fontSize: '0.9rem',
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {preview}...
                          </p>
                        </div>
                      )
                    })
                  ) : (
                    <p style={{ color: '#8b949e' }}>No chapters yet.</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                padding: '30px',
                background: '#161b22',
                borderTop: '1px solid #30363d',
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={handleEditDraft}
                  style={{
                    background: '#238636',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={e => e.target.style.background = '#2ea043'}
                  onMouseLeave={e => e.target.style.background = '#238636'}
                >
                  ✏️ Edit Draft
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    background: 'transparent',
                    color: '#f85149',
                    border: '1px solid #f85149',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = 'rgba(248, 81, 73, 0.1)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = 'transparent'
                  }}
                >
                  🗑️ Delete Draft
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          onClick={() => setShowDeleteConfirm(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '12px',
              padding: '30px',
              width: '380px',
              color: '#c9d1d9',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            <h3 style={{ color: '#f85149', marginBottom: '15px', fontSize: '1.2rem' }}>
              🗑️ Delete Draft?
            </h3>
            <p style={{ color: '#8b949e', marginBottom: '25px', lineHeight: '1.5' }}>
              Are you sure you want to delete "{draft.bookTitle}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleDeleteDraft}
                style={{
                  background: '#f85149',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  flex: 1,
                  transition: 'background 0.3s'
                }}
                onMouseEnter={e => e.target.style.background = '#da3633'}
                onMouseLeave={e => e.target.style.background = '#f85149'}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  background: 'transparent',
                  color: '#58a6ff',
                  border: '1px solid #58a6ff',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  flex: 1,
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => {
                  e.target.style.background = 'rgba(88, 166, 255, 0.1)'
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'transparent'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default MyDrafts
