import { Link } from 'react-router-dom'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>E-Library</h3>
          <p>Discover timeless books, modern ideas, and free learning resources all in one place.</p>
          <a className="footer-cta" href="mailto:vivektripathi@gmail.com">Request a Book</a>
        </div>

        <div className="footer-section">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/history">Reading History</Link></li>
            <li><Link to="/aboutus">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p><span>Email:</span> vivektripathi@gmail.com</p>
          <p><span>Phone:</span> +91 93054 71069</p>
          <p><span>Hours:</span> Mon - Sat, 9:00 AM - 6:00 PM</p>
        </div>

        <div className="footer-section">
          <h4>Community</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://x.com" target="_blank" rel="noreferrer">X / Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright {year} E-Library. Built for readers, students, and lifelong learners.</p>
      </div>
    </footer>
  )
}

export default Footer
