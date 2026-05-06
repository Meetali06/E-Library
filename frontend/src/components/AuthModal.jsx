import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:5000/api'

function AuthModal({ show, onClose, onLoginSuccess }) {
  const [loginType, setLoginType] = useState('user')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  
  useEffect(() => {
    if (show) {
      setMessage('')
    }
  }, [show])
  
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      let response
      if (loginType === 'admin') {
        response = await fetch(`${API_BASE}/auth/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: loginData.email, password: loginData.password })
        })
      } else {
        response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginData.email, password: loginData.password })
        })
      }
      
      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('studentToken', data.token)
        localStorage.setItem('studentUser', JSON.stringify(data.user))
        localStorage.setItem('loginType', loginType)
        onClose()
        if (onLoginSuccess) onLoginSuccess()
        
        if (loginType === 'admin') {
          alert('Admin login successful! Welcome back, ' + data.user.username)
          window.open('/admin', '_blank')
        } else {
          alert('Login successful! Welcome back, ' + data.user.name)
        }
      } else {
        setMessage({ type: 'error', text: data.msg })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Connection error. Please make sure the backend server is running on port 5000.' })
    } finally {
      setLoading(false)
    }
  }
  

  
  if (!show) return null
  
  return (
    <div className="auth-modal" onClick={(e) => e.target.className.includes('auth-modal') && onClose()}
      style={{
        display: 'flex',
        position: 'fixed',
        zIndex: 9999,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(5px)',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease-in'
      }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .auth-form-group input:focus, .auth-form-group select:focus {
          outline: none;
          border-color: #6c5ce7 !important;
          box-shadow: 0 0 10px rgba(108, 92, 231, 0.2) !important;
        }
        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(108, 92, 231, 0.3);
        }
        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
      
      <div className="auth-modal-content" style={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        width: '440px',
        maxWidth: '95%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        animation: 'slideUp 0.4s ease-out'
      }}>
        {/* Header */}
        <div className="auth-modal-header" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '40px 30px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <span className="auth-close" onClick={onClose} style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            color: 'white',
            fontSize: '32px',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.3s'
          }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>&times;</span>
          
          <div style={{ marginBottom: '15px', fontSize: '40px' }}>📚</div>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: 700 }}>E-Library</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>Access your digital library</p>
        </div>
        
        <div className="auth-modal-body" style={{ padding: '30px' }}>

          
          {/* Message */}
          {message && (
            <div style={{
              color: message.type === 'error' ? '#e74c3c' : '#27ae60',
              fontSize: '14px',
              marginBottom: '20px',
              padding: '12px 15px',
              background: message.type === 'error' ? '#fadbd8' : '#d5f4e6',
              border: `2px solid ${message.type === 'error' ? '#e74c3c' : '#27ae60'}`,
              borderRadius: '8px',
              animation: 'slideUp 0.3s ease-out'
            }}>
              <i className={`fas fa-${message.type === 'error' ? 'exclamation-circle' : 'check-circle'}`}></i> {message.text}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
              {/* Login Type Selector */}
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px',
                fontSize: '13px',
                backgroundColor: '#f9f9f9',
                padding: '8px',
                borderRadius: '8px'
              }}>
                <button
                  type="button"
                  onClick={() => { setLoginType('user'); setMessage('') }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: loginType === 'user' ? '#667eea' : 'transparent',
                    color: loginType === 'user' ? 'white' : '#666',
                    fontWeight: loginType === 'user' ? 600 : 500,
                    transition: 'all 0.3s'
                  }}>
                  <i className="fas fa-user-graduate"></i> Student
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginType('admin'); setMessage('') }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: loginType === 'admin' ? '#667eea' : 'transparent',
                    color: loginType === 'admin' ? 'white' : '#666',
                    fontWeight: loginType === 'admin' ? 600 : 500,
                    transition: 'all 0.3s'
                  }}>
                  <i className="fas fa-user-tie"></i> Admin
                </button>
              </div>
              
              {/* Email/Username Field */}
              <div className="auth-form-group" style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#333', fontSize: '14px' }}>
                  <i className={`fas fa-${loginType === 'user' ? 'envelope' : 'user'}`} style={{ marginRight: '8px', color: '#667eea' }}></i>
                  {loginType === 'user' ? 'Email' : 'Admin Username'}
                </label>
                <input
                  type="text"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  placeholder={loginType === 'user' ? 'your.email@example.com' : 'admin'}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              {/* Password Field */}
              <div className="auth-form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#333', fontSize: '14px' }}>
                  <i className="fas fa-lock" style={{ marginRight: '8px', color: '#667eea' }}></i>Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      paddingRight: '45px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#667eea',
                      fontSize: '18px',
                      padding: '5px'
                    }}>
                    <i className={`fas fa-eye${showPassword ? '' : '-slash'}`}></i>
                  </button>
                </div>
              </div>
              
              {/* Login Button */}
              <button type="submit" disabled={loading} className="auth-btn" style={{
                width: '100%',
                padding: '13px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1
              }}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Logging in...</> : <><i className="fas fa-sign-in-alt"></i> Login to Account</>}
              </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
