import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getUserHistory, clearUserHistory } from '../utils/historyStorage'

function History() {
  const [history, setHistory] = useState([])

  const user = useMemo(() => {
    try {
      const rawUser = localStorage.getItem('studentUser')
      return rawUser ? JSON.parse(rawUser) : null
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    setHistory(getUserHistory())
  }, [])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role === 'admin') {
    return <Navigate to="/home" replace />
  }

  const handleClearHistory = () => {
    clearUserHistory()
    setHistory([])
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-4 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 style={{ margin: 0 }}>Reading History</h2>
          {history.length > 0 && (
            <button className="btn btn-outline-danger btn-sm" onClick={handleClearHistory}>
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="alert alert-info" role="alert">
            No books opened yet. Start reading from <Link to="/home">Home</Link> and your history will appear here.
          </div>
        ) : (
          <div className="list-group">
            {history.map((item, index) => (
              <Link
                key={`${item.path}-${item.openedAt}-${index}`}
                to={item.path || '/home'}
                className="list-group-item list-group-item-action"
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{item.title}</h5>
                  <small>{new Date(item.openedAt).toLocaleString()}</small>
                </div>
                {item.description && <p className="mb-1 text-muted">{item.description}</p>}
                <small className="text-secondary">Source: {item.source}</small>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default History
