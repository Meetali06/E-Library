import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'

function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')
  
  useEffect(() => {
    checkAuthStatus()
  }, [])
  
  const checkAuthStatus = () => {
    const token = localStorage.getItem('studentToken')
    const user = localStorage.getItem('studentUser')
    
    if (token && user) {
      const userData = JSON.parse(user)
      setIsLoggedIn(true)
      setUserName(userData.name)
      setUserRole(userData.role || 'student')
    } else {
      setIsLoggedIn(false)
      setUserRole('')
    }
  }
  
  const handleCategoryClick = (categoryId) => {
    navigate(`/home#${categoryId}`)
    setTimeout(() => {
      const element = document.getElementById(categoryId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }
  
  const logout = () => {
    localStorage.removeItem('studentToken')
    localStorage.removeItem('studentUser')
    localStorage.removeItem('loginType')
    localStorage.removeItem('rememberMe')
    setIsLoggedIn(false)
    setUserRole('')
    navigate('/login')
  }
  
  return (
    <nav className="navbar navbar-expand-lg site-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">E-Library</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/home">Home</Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Categories
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#Educational" onClick={(e) => { e.preventDefault(); handleCategoryClick('Educational') }}>Educational</a></li>
                <li><a className="dropdown-item" href="#SelfHelp" onClick={(e) => { e.preventDefault(); handleCategoryClick('SelfHelp') }}>Self-Help & Motivation</a></li>
                <li><a className="dropdown-item" href="#Fiction" onClick={(e) => { e.preventDefault(); handleCategoryClick('Fiction') }}>Fiction & Novels</a></li>
                <li><a className="dropdown-item" href="#Biography" onClick={(e) => { e.preventDefault(); handleCategoryClick('Biography') }}>Biography & Inspiration</a></li>
                <li><a className="dropdown-item" href="#Mystery" onClick={(e) => { e.preventDefault(); handleCategoryClick('Mystery') }}>Mystery & Thriller</a></li>
                <li><a className="dropdown-item" href="#Entertainment" onClick={(e) => { e.preventDefault(); handleCategoryClick('Entertainment') }}>Entertainment</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#Science" onClick={(e) => { e.preventDefault(); handleCategoryClick('Science') }}>Science & Technology</a></li>
                <li><a className="dropdown-item" href="#Philosophy" onClick={(e) => { e.preventDefault(); handleCategoryClick('Philosophy') }}>Philosophy & Psychology</a></li>
                <li><a className="dropdown-item" href="#Romance" onClick={(e) => { e.preventDefault(); handleCategoryClick('Romance') }}>Romance</a></li>
                <li><a className="dropdown-item" href="#History" onClick={(e) => { e.preventDefault(); handleCategoryClick('History') }}>History & Politics</a></li>
                <li><a className="dropdown-item" href="#Horror" onClick={(e) => { e.preventDefault(); handleCategoryClick('Horror') }}>Horror & Supernatural</a></li>
                <li><a className="dropdown-item" href="#Poetry" onClick={(e) => { e.preventDefault(); handleCategoryClick('Poetry') }}>Poetry & Literature</a></li>
                <li><a className="dropdown-item" href="#Business" onClick={(e) => { e.preventDefault(); handleCategoryClick('Business') }}>Business & Finance</a></li>
                <li><a className="dropdown-item" href="#Health" onClick={(e) => { e.preventDefault(); handleCategoryClick('Health') }}>Health & Wellness</a></li>
                <li><a className="dropdown-item" href="#Children" onClick={(e) => { e.preventDefault(); handleCategoryClick('Children') }}>Children & Young Adults</a></li>
                <li><a className="dropdown-item" href="#Travel" onClick={(e) => { e.preventDefault(); handleCategoryClick('Travel') }}>Travel & Adventure</a></li>
                <li><a className="dropdown-item" href="#Comics" onClick={(e) => { e.preventDefault(); handleCategoryClick('Comics') }}>Comics & Graphic Novels</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/aboutus">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/write-book"
                style={{ color: '#e94560', fontWeight: 600 }}
              >
                ✍ Write Your Book
              </Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/my-drafts"
                  style={{ color: '#58a6ff', fontWeight: 600 }}
                >
                  📂 My Drafts
                </Link>
              </li>
            )}
            {isLoggedIn && userRole !== 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/history">History</Link>
              </li>
            )}
            {isLoggedIn && userRole !== 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/favorites">Favorites</Link>
              </li>
            )}
            {userRole === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin" target="_blank">Admin</Link>
              </li>
            )}
          </ul>
          
          <div className="navbar-actions">
            <SearchBar />

            {isLoggedIn ? (
              <div className="user-menu show">
                <span id="userName">Welcome, {userName}</span>
                <button className="btn btn-sm btn-danger" onClick={logout}>Logout</button>
              </div>
            ) : (
              <div className="auth-actions d-flex align-items-center gap-2 ms-2">
                <Link className="btn btn-outline-light btn-sm" to="/login">
                  <i className="fas fa-sign-in-alt me-1"></i> Login
                </Link>
                <Link className="btn btn-light btn-sm" to="/signup">
                  <i className="fas fa-user-plus me-1"></i> Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
