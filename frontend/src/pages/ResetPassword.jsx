import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Auth.css'

function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset.')
    }
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const validateForm = () => {
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
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!token) {
      setError('No reset token found. Please try again.')
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token: token,
        password: formData.password
      })

      setSuccess('Password reset successful! Redirecting to login...')
      
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.msg || 'Error resetting password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="auth-card card shadow-lg" style={{ width: '100%', maxWidth: '450px' }}>
          {/* Header */}
          <div className="card-header auth-header text-center" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px 20px 0 0',
            padding: '40px 30px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔑</div>
            <h2 className="text-white mb-2" style={{ fontWeight: 700, fontSize: '28px' }}>Reset Password</h2>
            <p className="text-white mb-0" style={{ opacity: 0.9, fontSize: '14px' }}>Create your new password</p>
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
              </div>
            )}

            {!token ? (
              <div className="text-center">
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>❌</div>
                <h5 style={{ color: '#333', fontWeight: 700, marginBottom: '15px' }}>Invalid Token</h5>
                <p style={{ color: '#666', fontSize: '15px', marginBottom: '30px' }}>
                  The reset link has expired or is invalid. Please request a new password reset.
                </p>
                <Link to="/forgot-password" className="btn btn-lg w-100" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  padding: '12px 20px'
                }}>
                  <i className="fas fa-redo me-2"></i> Request New Reset Link
                </Link>
              </div>
            ) : (
              <>
                {/* Reset Password Form */}
                <form onSubmit={handleSubmit}>
                  {/* New Password Field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label" style={{ fontWeight: 600, color: '#333' }}>
                      <i className="fas fa-lock me-2" style={{ color: '#667eea' }}></i>New Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control form-control-lg"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your new password"
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
                    <small style={{ color: '#999', display: 'block', marginTop: '8px' }}>
                      Password must be at least 6 characters
                    </small>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label" style={{ fontWeight: 600, color: '#333' }}>
                      <i className="fas fa-lock me-2" style={{ color: '#667eea' }}></i>Confirm Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-control form-control-lg"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your new password"
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
                    className="btn btn-lg w-100"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      padding: '12px 20px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Resetting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check me-2"></i> Reset Password
                      </>
                    )}
                  </button>

                  {/* Back to Login Link */}
                  <p style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' }}>
                    Remember your password? {' '}
                    <Link to="/login" className="text-decoration-none" style={{ color: '#667eea', fontWeight: 600 }}>
                      Back to Login
                    </Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
