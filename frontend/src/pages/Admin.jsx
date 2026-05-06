import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import 'bootstrap/dist/css/bootstrap.min.css'

const API_BASE = import.meta.env.VITE_API_URL

function Admin() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeUsers: 0,
    adminUsers: 0
  })
  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([])
  const [showAddBook, setShowAddBook] = useState(false)
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    category: '',
    description: ''
  })
  const [bookImage, setBookImage] = useState(null)
  const [bookPdf, setBookPdf] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    checkAdminAccess()
    if (activeTab === 'dashboard') {
      fetchStats()
    } else if (activeTab === 'users') {
      fetchUsers()
    } else if (activeTab === 'books') {
      fetchBooks()
    }
  }, [activeTab])

  const checkAdminAccess = () => {
    const user = localStorage.getItem('studentUser')
    if (user) {
      const userData = JSON.parse(user)
      if (userData.role !== 'admin') {
        navigate('/home')
      }
    } else {
      navigate('/login')
    }
  }

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get(`${API_BASE}/api/admin/stats`)
      setStats(response.data.stats)
      setSuccess('Statistics refreshed successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Error fetching statistics')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/api/admin/students`)
      setUsers(response.data.users)
    } catch (err) {
      setError('Error fetching users')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return

    try {
      await axios.delete(`${API_BASE}/api/admin/users/${userId}`)
      setSuccess('User deleted successfully')
      fetchUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Error deleting user')
    }
  }

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin'
    try {
      await axios.put(`${API_BASE}/api/admin/users/${userId}/role`, { role: newRole })
      setSuccess(`User role updated to ${newRole}`)
      fetchUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Error updating role')
    }
  }

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/api/books`)
      setBooks(response.data.books || [])
    } catch (err) {
      setError('Error fetching books')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async (e) => {
    e.preventDefault()
    if (!bookForm.title || !bookForm.category) {
      setError('Title and category are required')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('title', bookForm.title)
      formData.append('author', bookForm.author)
      formData.append('category', bookForm.category)
      formData.append('description', bookForm.description)
      if (bookImage) formData.append('image', bookImage)
      if (bookPdf) formData.append('pdf', bookPdf)

      await axios.post(`${API_BASE}/api/books`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setSuccess('Book added successfully!')
      setBookForm({ title: '', author: '', category: '', description: '' })
      setBookImage(null)
      setBookPdf(null)
      setShowAddBook(false)
      fetchBooks()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding book')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return

    try {
      await axios.delete(`${API_BASE}/api/books/${bookId}`)
      setSuccess('Book deleted successfully')
      fetchBooks()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Error deleting book')
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container-fluid mt-4" style={{ minHeight: '80vh' }}>
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 style={{ fontWeight: 700, color: '#333' }}>
                  <i className="fas fa-user-shield me-3" style={{ color: '#667eea' }}></i>
                  Admin Panel
                </h2>
                <p className="text-muted mb-0">Manage your E-Library system</p>
              </div>
              <div>
                <span className="badge bg-success px-3 py-2" style={{ fontSize: '14px' }}>
                  <i className="fas fa-check-circle me-2"></i>Admin Access
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>{error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}
        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="fas fa-check-circle me-2"></i>{success}
            <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
          </div>
        )}

        {/* Tabs Navigation */}
        <ul className="nav nav-tabs nav-fill mb-4" style={{ borderBottom: '2px solid #e0e0e0' }}>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
              style={{
                fontWeight: 600,
                color: activeTab === 'dashboard' ? '#667eea' : '#666',
                borderBottom: activeTab === 'dashboard' ? '3px solid #667eea' : 'none',
                background: 'none',
                border: 'none',
                width: '100%',
                padding: '12px'
              }}
            >
              <i className="fas fa-chart-line me-2"></i>Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
              style={{
                fontWeight: 600,
                color: activeTab === 'users' ? '#667eea' : '#666',
                borderBottom: activeTab === 'users' ? '3px solid #667eea' : 'none',
                background: 'none',
                border: 'none',
                width: '100%',
                padding: '12px'
              }}
            >
              <i className="fas fa-users me-2"></i>Users
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'books' ? 'active' : ''}`}
              onClick={() => setActiveTab('books')}
              style={{
                fontWeight: 600,
                color: activeTab === 'books' ? '#667eea' : '#666',
                borderBottom: activeTab === 'books' ? '3px solid #667eea' : 'none',
                background: 'none',
                border: 'none',
                width: '100%',
                padding: '12px'
              }}
            >
              <i className="fas fa-book me-2"></i>Books
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="tab-pane fade show active">
              <div className="row g-4">
                {/* Total Users Card */}
                <div className="col-md-3">
                  <div className="card shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="text-white mb-1" style={{ fontSize: '14px', opacity: 0.9 }}>Total Users</p>
                          <h3 className="mb-0 text-white" style={{ fontWeight: 700 }}>{stats.totalUsers}</h3>
                        </div>
                        <div className="bg-white bg-opacity-25 p-3 rounded-circle">
                          <i className="fas fa-users fa-2x text-white"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Users Card */}
                <div className="col-md-3">
                  <div className="card shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="text-white mb-1" style={{ fontSize: '14px', opacity: 0.9 }}>Active Users</p>
                          <h3 className="mb-0 text-white" style={{ fontWeight: 700 }}>{stats.activeUsers}</h3>
                        </div>
                        <div className="bg-white bg-opacity-25 p-3 rounded-circle">
                          <i className="fas fa-user-check fa-2x text-white"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Books Card */}
                <div className="col-md-3">
                  <div className="card shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="text-white mb-1" style={{ fontSize: '14px', opacity: 0.9 }}>Total Books</p>
                          <h3 className="mb-0 text-white" style={{ fontWeight: 700 }}>{stats.totalBooks}</h3>
                        </div>
                        <div className="bg-white bg-opacity-25 p-3 rounded-circle">
                          <i className="fas fa-book fa-2x text-white"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Users Card */}
                <div className="col-md-3">
                  <div className="card shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="text-white mb-1" style={{ fontSize: '14px', opacity: 0.9 }}>Admins</p>
                          <h3 className="mb-0 text-white" style={{ fontWeight: 700 }}>{stats.adminUsers}</h3>
                        </div>
                        <div className="bg-white bg-opacity-25 p-3 rounded-circle">
                          <i className="fas fa-user-shield fa-2x text-white"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="row mt-5">
                <div className="col-12">
                  <h5 className="mb-3" style={{ fontWeight: 600 }}>Quick Actions</h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <button
                        className="btn btn-lg w-100 d-flex align-items-center justify-content-center"
                        onClick={() => setActiveTab('users')}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '20px',
                          fontWeight: 600
                        }}
                      >
                        <i className="fas fa-users me-3 fa-lg"></i>
                        Manage Users
                      </button>
                    </div>
                    <div className="col-md-4">
                      <button
                        className="btn btn-lg w-100 d-flex align-items-center justify-content-center"
                        onClick={() => setActiveTab('books')}
                        style={{
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '20px',
                          fontWeight: 600
                        }}
                      >
                        <i className="fas fa-book me-3 fa-lg"></i>
                        Manage Books
                      </button>
                    </div>
                    <div className="col-md-4">
                      <button
                        className="btn btn-lg w-100 d-flex align-items-center justify-content-center"
                        onClick={fetchStats}
                        disabled={loading}
                        style={{
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '20px',
                          fontWeight: 600,
                          opacity: loading ? 0.7 : 1,
                          cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'} me-3 fa-lg`}></i>
                        {loading ? 'Refreshing...' : 'Refresh Stats'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="tab-pane fade show active">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white" style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <h5 className="mb-0" style={{ fontWeight: 600 }}>
                    <i className="fas fa-users me-2" style={{ color: '#667eea' }}></i>
                    All Users ({users.length})
                  </h5>
                </div>
                <div className="card-body p-0">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading users...</p>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-users fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No users found</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                          <tr>
                            <th style={{ fontWeight: 600, padding: '15px' }}>Name</th>
                            <th style={{ fontWeight: 600, padding: '15px' }}>Email</th>
                            <th style={{ fontWeight: 600, padding: '15px' }}>Role</th>
                            <th style={{ fontWeight: 600, padding: '15px' }}>Status</th>
                            <th style={{ fontWeight: 600, padding: '15px' }}>Joined</th>
                            <th style={{ fontWeight: 600, padding: '15px' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user._id}>
                              <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                                <div className="d-flex align-items-center">
                                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                    <i className="fas fa-user" style={{ color: '#667eea' }}></i>
                                  </div>
                                  <strong>{user.name}</strong>
                                </div>
                              </td>
                              <td style={{ padding: '15px', verticalAlign: 'middle' }}>{user.email}</td>
                              <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                                <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                  {user.role === 'admin' ? (
                                    <><i className="fas fa-shield-alt me-1"></i>Admin</>
                                  ) : (
                                    <><i className="fas fa-user me-1"></i>Student</>
                                  )}
                                </span>
                              </td>
                              <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                                <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                  {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                                <div className="btn-group" role="group">
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleToggleRole(user._id, user.role)}
                                    title={`Change to ${user.role === 'admin' ? 'Student' : 'Admin'}`}
                                  >
                                    <i className="fas fa-user-cog"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteUser(user._id)}
                                    title="Delete User"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Books Tab */}
          {activeTab === 'books' && (
            <div className="tab-pane fade show active">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white" style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0" style={{ fontWeight: 600 }}>
                      <i className="fas fa-book me-2" style={{ color: '#667eea' }}></i>
                      Book Management ({books.length})
                    </h5>
                    <button
                      className="btn btn-sm"
                      onClick={() => setShowAddBook(!showAddBook)}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      <i className={`fas ${showAddBook ? 'fa-times' : 'fa-plus'} me-2`}></i>
                      {showAddBook ? 'Cancel' : 'Add New Book'}
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {/* Add Book Form */}
                  {showAddBook && (
                    <div className="card mb-4" style={{ border: '2px dashed #667eea' }}>
                      <div className="card-body">
                        <h6 className="mb-3" style={{ fontWeight: 600, color: '#667eea' }}>
                          <i className="fas fa-plus-circle me-2"></i>Add New Book
                        </h6>
                        <form onSubmit={handleAddBook}>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Title *</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter book title"
                                value={bookForm.title}
                                onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Author</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter author name"
                                value={bookForm.author}
                                onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Category *</label>
                              <select
                                className="form-select"
                                value={bookForm.category}
                                onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                                required
                              >
                                <option value="">Select category</option>
                                <option value="Educational">Educational</option>
                                <option value="Self-Help & Motivation">Self-Help & Motivation</option>
                                <option value="Fiction & Novels">Fiction & Novels</option>
                                <option value="Biography & Inspiration">Biography & Inspiration</option>
                                <option value="Mystery & Thriller">Mystery & Thriller</option>
                                <option value="Entertainment">Entertainment</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Description</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Short description"
                                value={bookForm.description}
                                onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Cover Image</label>
                              <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => setBookImage(e.target.files[0])}
                              />
                              <small className="text-muted">JPG, PNG, WEBP (max 50MB)</small>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">PDF File</label>
                              <input
                                type="file"
                                className="form-control"
                                accept=".pdf"
                                onChange={(e) => setBookPdf(e.target.files[0])}
                              />
                              <small className="text-muted">PDF only (max 50MB)</small>
                            </div>
                            <div className="col-12">
                              <button
                                type="submit"
                                className="btn px-4 py-2"
                                disabled={loading}
                                style={{
                                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                  color: 'white',
                                  border: 'none',
                                  fontWeight: 600
                                }}
                              >
                                {loading ? (
                                  <><i className="fas fa-spinner fa-spin me-2"></i>Adding...</>
                                ) : (
                                  <><i className="fas fa-save me-2"></i>Add Book</>
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Book List */}
                  {loading && !showAddBook ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading books...</p>
                    </div>
                  ) : books.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-book fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No books found. Click "Add New Book" to get started.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                          <tr>
                            <th style={{ fontWeight: 600, padding: '15px' }}>Cover</th>
                            <th style={{ fontWeight: 600, padding: '15px' }}>Title</th>
                            <th style={{ fontWeight: 600, padding: '15px' }}>Author</th>
                            <th style={{ fontWeight: 600, padding: '15px' }}>Category</th>
                            <th style={{ fontWeight: 600, padding: '15px' }}>Added</th>
                            <th style={{ fontWeight: 600, padding: '15px' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {books.map((book) => (
                            <tr key={book._id}>
                              <td style={{ padding: '10px', verticalAlign: 'middle' }}>
                                {book.imageUrl ? (
                                  <img
                                    src={`${API_BASE}${book.imageUrl}`}
                                    alt={book.title}
                                    style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '4px' }}
                                  />
                                ) : (
                                  <div style={{ width: '50px', height: '65px', background: '#e0e0e0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-book text-muted"></i>
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                                <strong>{book.title}</strong>
                                {book.description && <br />}
                                {book.description && <small className="text-muted">{book.description}</small>}
                              </td>
                              <td style={{ padding: '15px', verticalAlign: 'middle' }}>{book.author || '-'}</td>
                              <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                                <span className="badge bg-info">{book.category}</span>
                              </td>
                              <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                                {new Date(book.createdAt).toLocaleDateString()}
                              </td>
                              <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                                <div className="btn-group" role="group">
                                  {book.pdfUrl && (
                                    <a
                                      href={`${API_BASE}${book.pdfUrl}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-sm btn-outline-primary"
                                      title="View PDF"
                                    >
                                      <i className="fas fa-file-pdf"></i>
                                    </a>
                                  )}
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteBook(book._id)}
                                    title="Delete Book"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Admin
