import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('studentToken')
    const userData = localStorage.getItem('studentUser')

    if (!token || !userData) {
      navigate('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('studentToken')
    localStorage.removeItem('studentUser')
    localStorage.removeItem('loginType')
    localStorage.removeItem('rememberMe')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status" style={{ color: '#667eea' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container-fluid">
          <div className="navbar-brand d-flex align-items-center">
            <span style={{ fontSize: '28px', marginRight: '10px' }}>📚</span>
            <span style={{ fontWeight: 700, fontSize: '20px' }}>E-Library</span>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <span className="nav-link" style={{ cursor: 'default' }}>
                  <i className="fas fa-user me-2"></i>Welcome, {user?.name || 'User'}
                </span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-light btn-sm">
                  <i className="fas fa-sign-out-alt me-2"></i>Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card shadow-lg" style={{ borderRadius: '15px', border: 'none' }}>
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div style={{ fontSize: '80px', marginBottom: '20px' }}>👋</div>
                  <h1 style={{ color: '#333', fontWeight: 700, marginBottom: '10px' }}>Welcome to E-Library</h1>
                  <p style={{ color: '#666', fontSize: '16px' }}>Your personal digital library is ready to explore</p>
                </div>

                <div className="row mt-5">
                  <div className="col-md-4 mb-3">
                    <div className="card text-center p-4" style={{ borderRadius: '12px', border: '2px solid #e0e0e0', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#667eea'
                      e.currentTarget.style.transform = 'translateY(-5px)'
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.1)'
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}>
                      <i className="fas fa-book-open" style={{ fontSize: '40px', color: '#667eea', marginBottom: '10px' }}></i>
                      <h5 style={{ color: '#333', fontWeight: 600 }}>Browse Books</h5>
                      <p style={{ fontSize: '13px', color: '#666' }}>Explore our collection</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card text-center p-4" style={{ borderRadius: '12px', border: '2px solid #e0e0e0', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#667eea'
                      e.currentTarget.style.transform = 'translateY(-5px)'
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.1)'
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}>
                      <i className="fas fa-heart" style={{ fontSize: '40px', color: '#667eea', marginBottom: '10px' }}></i>
                      <h5 style={{ color: '#333', fontWeight: 600 }}>Favorites</h5>
                      <p style={{ fontSize: '13px', color: '#666' }}>Your saved books</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card text-center p-4" style={{ borderRadius: '12px', border: '2px solid #e0e0e0', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#667eea'
                      e.currentTarget.style.transform = 'translateY(-5px)'
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.1)'
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}>
                      <i className="fas fa-user-circle" style={{ fontSize: '40px', color: '#667eea', marginBottom: '10px' }}></i>
                      <h5 style={{ color: '#333', fontWeight: 600 }}>Profile</h5>
                      <p style={{ fontSize: '13px', color: '#666' }}>Your account info</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-4" style={{ backgroundColor: '#f9f9f9', borderRadius: '12px', border: '2px solid #e0e0e0' }}>
                  <h5 style={{ color: '#333', fontWeight: 600, marginBottom: '15px' }}>
                    <i className="fas fa-user me-2" style={{ color: '#667eea' }}></i>User Information
                  </h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                        <strong style={{ color: '#333' }}>Name:</strong>
                      </p>
                      <p style={{ fontSize: '15px', color: '#333' }}>{user?.name || 'N/A'}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                        <strong style={{ color: '#333' }}>Email:</strong>
                      </p>
                      <p style={{ fontSize: '15px', color: '#333' }}>{user?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-lg w-100 mt-4"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    padding: '12px 20px'
                  }}
                >
                  <i className="fas fa-sign-out-alt me-2"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
