import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import 'bootstrap/dist/css/bootstrap.min.css'

function CountUp({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) requestAnimationFrame(step)
            else setCount(end)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

function AboutUs() {
  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #616f39 0%, #4a5428 100%)',
        padding: '80px 0',
        color: 'white'
      }}>
        <div className="container text-center">
          <h1 className="display-3 fw-bold mb-4" style={{ color: '#fff' }}>About E-Library</h1>
          <p className="lead fs-4" style={{ maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
            Your gateway to unlimited knowledge and learning resources, accessible anytime, anywhere
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                className="img-fluid rounded shadow-lg"
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop"
                alt="Modern Library"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </div>
            <div className="col-lg-6">
              <h2 className="mb-4" style={{ fontWeight: 700, color: '#333' }}>
                <i className="fas fa-book-reader me-3" style={{ color: '#616f39' }}></i>
                Our Mission
              </h2>
              <p className="fs-5 text-muted mb-4">
                We are dedicated to democratizing access to knowledge by providing a comprehensive digital library platform. 
                Our mission is to make quality educational resources available to everyone, breaking down barriers of distance and cost.
              </p>
              <p className="text-muted">
                E-Library offers thousands of books, journals, and educational materials spanning multiple genres and subjects. 
                Whether you're a student, researcher, or lifelong learner, our platform empowers you to explore, learn, and grow.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="row g-4 mt-5">
            <div className="col-12 text-center mb-4">
              <h2 className="fw-bold" style={{ color: '#333' }}>Why Choose E-Library?</h2>
              <p className="text-muted">Discover the features that make us stand out</p>
            </div>

            <div className="col-md-4">
              <div 
                className="card h-100 border-0 shadow-sm" 
                style={{ 
                  background: '#fff',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }} 
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                }}
              >
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'linear-gradient(135deg, #616f39 0%, #4a5428 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="fas fa-globe fa-2x text-white"></i>
                  </div>
                  <h4 className="fw-bold mb-3">24/7 Access</h4>
                  <p className="text-muted">
                    Access your favorite books anytime, anywhere. Our platform is available round the clock for your convenience.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div 
                className="card h-100 border-0 shadow-sm" 
                style={{ 
                  background: '#fff',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }} 
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                }}
              >
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'linear-gradient(135deg, #8ba555 0%, #616f39 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="fas fa-book-open fa-2x text-white"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Vast Collection</h4>
                  <p className="text-muted">
                    Explore thousands of books across multiple genres - from fiction to academic resources and everything in between.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div 
                className="card h-100 border-0 shadow-sm" 
                style={{ 
                  background: '#fff',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }} 
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                }}
              >
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'linear-gradient(135deg, #616f39 0%, #7a8a47 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="fas fa-user-graduate fa-2x text-white"></i>
                  </div>
                  <h4 className="fw-bold mb-3">For Everyone</h4>
                  <p className="text-muted">
                    Whether you're a student, professional, or casual reader, we have resources tailored to your needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div 
                className="card h-100 border-0 shadow-sm" 
                style={{ 
                  background: '#fff',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }} 
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                }}
              >
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'linear-gradient(135deg, #7a8a47 0%, #616f39 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="fas fa-search fa-2x text-white"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Easy Search</h4>
                  <p className="text-muted">
                    Find your desired books quickly with our advanced search and filtering system designed for efficiency.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div 
                className="card h-100 border-0 shadow-sm" 
                style={{ 
                  background: '#fff',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }} 
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                }}
              >
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'linear-gradient(135deg, #8ba555 0%, #5a6a2f 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="fas fa-mobile-alt fa-2x text-white"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Mobile Friendly</h4>
                  <p className="text-muted">
                    Read on any device - desktop, tablet, or smartphone. Our responsive design adapts to your screen.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div 
                className="card h-100 border-0 shadow-sm" 
                style={{ 
                  background: '#fff',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }} 
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                }}
              >
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'linear-gradient(135deg, #616f39 0%, #8ba555 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="fas fa-heart fa-2x text-white"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Free Access</h4>
                  <p className="text-muted">
                    Quality education should be free. Access all our resources without any subscription fees or hidden costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 mb-4 mb-md-0">
              <h2 className="display-4 fw-bold" style={{ color: '#616f39' }}><CountUp end={10000} suffix="+" /></h2>
              <p className="text-muted">Books Available</p>
            </div>
            <div className="col-md-3 mb-4 mb-md-0">
              <h2 className="display-4 fw-bold" style={{ color: '#8ba555' }}><CountUp end={5000} suffix="+" /></h2>
              <p className="text-muted">Active Users</p>
            </div>
            <div className="col-md-3 mb-4 mb-md-0">
              <h2 className="display-4 fw-bold" style={{ color: '#7a8a47' }}><CountUp end={50} suffix="+" /></h2>
              <p className="text-muted">Categories</p>
            </div>
            <div className="col-md-3">
              <h2 className="display-4 fw-bold" style={{ color: '#5a6a2f' }}>24/7</h2>
              <p className="text-muted">Support</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AboutUs
