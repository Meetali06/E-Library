import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Auth.css'

const API_BASE = import.meta.env.VITE_API_URL

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Full name is required')
      return false
    }
    if (formData.name.trim().length < 2) {
      setError('Full name must be at least 2 characters')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email format')
      return false
    }
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    if (!formData.confirmPassword) {
      setError('Please confirm your password')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Password and confirm password do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      setSuccess('Account created successfully! Redirecting to login...')
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      })

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="auth-card card shadow-lg" style={{ width: '100%', maxWidth: '500px' }}>
          {/* Header */}
          <div className="card-header auth-header text-center" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px 20px 0 0',
            padding: '40px 30px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📚</div>
            <h2 className="text-white mb-2" style={{ fontWeight: 700, fontSize: '28px' }}>E-Library</h2>
            <p className="text-white mb-0" style={{ opacity: 0.9, fontSize: '14px' }}>Create your account to access the library</p>
          </div>

          {/* Body */}
          <div className="card-body" style={{ padding: '40px 30px' }}>
            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                {success}
                <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              {/* Full Name Field */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label" style={{ fontWeight: 600, color: '#333' }}>
                  <i className="fas fa-user me-2" style={{ color: '#667eea' }}></i>Full Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                  style={{
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '12px 15px',
                    fontSize: '15px',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.boxShadow = '0 0 10px rgba(102, 126, 234, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Email Field */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label" style={{ fontWeight: 600, color: '#333' }}>
                  <i className="fas fa-envelope me-2" style={{ color: '#667eea' }}></i>Email Address
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                  style={{
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '12px 15px',
                    fontSize: '15px',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.boxShadow = '0 0 10px rgba(102, 126, 234, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label" style={{ fontWeight: 600, color: '#333' }}>
                  <i className="fas fa-lock me-2" style={{ color: '#667eea' }}></i>Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control form-control-lg"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    disabled={loading}
                    style={{
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px 0 0 8px',
                      padding: '12px 15px',
                      fontSize: '15px',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea'
                      e.target.style.boxShadow = '0 0 10px rgba(102, 126, 234, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    style={{
                      borderRadius: '0 8px 8px 0',
                      border: '2px solid #e0e0e0',
                      color: '#667eea'
                    }}
                  >
                    <i className={`fas fa-eye${showPassword ? '' : '-slash'}`}></i>
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label" style={{ fontWeight: 600, color: '#333' }}>
                  <i className="fas fa-check-circle me-2" style={{ color: '#667eea' }}></i>Confirm Password
                </label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-control form-control-lg"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    disabled={loading}
                    style={{
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px 0 0 8px',
                      padding: '12px 15px',
                      fontSize: '15px',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea'
                      e.target.style.boxShadow = '0 0 10px rgba(102, 126, 234, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    style={{
                      borderRadius: '0 8px 8px 0',
                      border: '2px solid #e0e0e0',
                      color: '#667eea'
                    }}
                  >
                    <i className={`fas fa-eye${showConfirmPassword ? '' : '-slash'}`}></i>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-lg w-100 mb-3"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  padding: '12px 20px',
                  fontSize: '16px',
                  transition: 'all 0.3s',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)')}
                onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = 'none')}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i> Creating Account...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus me-2"></i> Create Account
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className="mb-0" style={{ color: '#666', fontSize: '14px' }}>
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none fw-bold" style={{ color: '#667eea' }}>
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
