import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getUserFavorites, clearUserFavorites, removeBookFromFavorites } from '../utils/favoritesStorage'

function Favorites() {
  const [favorites, setFavorites] = useState([])

  const user = useMemo(() => {
    try {
      const rawUser = localStorage.getItem('studentUser')
      return rawUser ? JSON.parse(rawUser) : null
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    setFavorites(getUserFavorites())
  }, [])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role === 'admin') {
    return <Navigate to="/home" replace />
  }

  const handleClearFavorites = () => {
    clearUserFavorites()
    setFavorites([])
  }

  const handleRemoveFavorite = (book) => {
    removeBookFromFavorites(book)
    setFavorites(getUserFavorites())
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-4 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 style={{ margin: 0 }}>Favorite Books</h2>
          {favorites.length > 0 && (
            <button className="btn btn-outline-danger btn-sm" onClick={handleClearFavorites}>
              Clear Favorites
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="alert alert-info" role="alert">
            No favorite books yet. Open a book and click the Favorite (star) button.
          </div>
        ) : (
          <div className="list-group">
            {favorites.map((item, index) => (
              <div key={`${item.path}-${item.readUrl}-${item.addedAt}-${index}`} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <Link
                    to={item.path || '/home'}
                    state={{
                      title: item.title,
                      author: item.author,
                      readUrl: item.readUrl,
                      img: item.img
                    }}
                    className="text-decoration-none flex-grow-1"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1" style={{ color: '#212529' }}>{item.title}</h5>
                      <small>{new Date(item.addedAt).toLocaleString()}</small>
                    </div>
                    {item.author && <p className="mb-1 text-muted">by {item.author}</p>}
                    {item.description && <p className="mb-1 text-muted">{item.description}</p>}
                    <small className="text-secondary">Source: {item.source}</small>
                  </Link>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemoveFavorite(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Favorites
