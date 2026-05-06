import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Auth.css'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('email') // email, code, reset

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email format')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateEmail()) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Call your backend endpoint to send reset email
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email: email
      })

      setSuccess('Password reset link has been sent to your email!')
      setStep('email-sent')
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.msg || 'Email not found or error occurred. Please try again.')
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
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔐</div>
            <h2 className="text-white mb-2" style={{ fontWeight: 700, fontSize: '28px' }}>Reset Password</h2>
            <p className="text-white mb-0" style={{ opacity: 0.9, fontSize: '14px' }}>Recover your account access</p>
          </div>

          {/* Body */}
          <div className="card-body" style={{ padding: '40px 30px' }}>
            {step === 'email-sent' ? (
              <>
                {/* Success State */}
                <div className="text-center">
                  <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
                  <h5 style={{ color: '#333', fontWeight: 700, marginBottom: '15px' }}>Email Sent Successfully!</h5>
                  <p style={{ color: '#666', fontSize: '15px', marginBottom: '20px' }}>
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p style={{ color: '#999', fontSize: '13px', marginBottom: '30px' }}>
                    Please check your email and follow the link to reset your password. Redirecting to login in a moment...
                  </p>
                  <Link to="/login" className="btn btn-lg w-100" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    padding: '12px 20px'
                  }}>
                    <i className="fas fa-arrow-left me-2"></i> Back to Login
                  </Link>
                </div>
              </>
            ) : (
              <>
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

                {/* Forgot Password Form */}
                <form onSubmit={handleSubmit}>
                  <p style={{ color: '#666', fontSize: '15px', marginBottom: '25px', textAlign: 'center' }}>
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  {/* Email Field */}
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label" style={{ fontWeight: 600, color: '#333' }}>
                      <i className="fas fa-envelope me-2" style={{ color: '#667eea' }}></i>Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError('')
                      }}
                      placeholder="Enter your registered email"
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
                        <i className="fas fa-spinner fa-spin me-2"></i> Sending Link...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i> Send Reset Link
                      </>
                    )}
                  </button>

                  {/* Back to Login Link */}
                  <div className="text-center">
                    <p className="mb-0" style={{ color: '#666', fontSize: '14px' }}>
                      Remember your password?{' '}
                      <Link to="/login" className="text-decoration-none fw-bold" style={{ color: '#667eea' }}>
                        Login here
                      </Link>
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
