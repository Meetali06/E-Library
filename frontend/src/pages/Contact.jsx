import { useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import 'bootstrap/dist/css/bootstrap.min.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await axios.post('http://localhost:5000/api/contact/send', formData)
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send message. Please try again.')
      setTimeout(() => {
        setError('')
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #616f39 0%, #4a5630 100%)',
        padding: '80px 0',
        color: 'white'
      }}>
        <div className="container text-center">
          <h1 className="display-3 fw-bold mb-4" style={{ color: '#fff' }}>Contact Us</h1>
          <p className="lead fs-4" style={{ maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5" style={{ background: '#fff' }}>
        <div className="container">
          <div className="row g-5">
            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-lg" style={{ background: '#fff' }}>
                <div className="card-body p-5" style={{ background: '#fff' }}>
                  <h2 className="mb-4 fw-bold" style={{ color: '#333' }}>
                    <i className="fas fa-paper-plane me-3" style={{ color: '#616f39' }}></i>
                    Send us a Message
                  </h2>
                  
                  {submitted && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                      <i className="fas fa-check-circle me-2"></i>
                      Message sent successfully! Check your email for confirmation.
                      <button type="button" className="btn-close" onClick={() => setSubmitted(false)}></button>
                    </div>
                  )}

                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                      <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-user me-2" style={{ color: '#616f39' }}></i>
                          Your Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your name"
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-envelope me-2" style={{ color: '#616f39' }}></i>
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your.email@example.com"
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-tag me-2" style={{ color: '#616f39' }}></i>
                          Subject
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="What is this regarding?"
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-comment-dots me-2" style={{ color: '#616f39' }}></i>
                          Message
                        </label>
                        <textarea
                          className="form-control form-control-lg"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows="5"
                          placeholder="Write your message here..."
                          style={{ borderRadius: '10px' }}
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-lg w-100"
                          disabled={loading}
                          style={{
                            background: 'linear-gradient(135deg, #616f39 0%, #4a5630 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '15px',
                            fontWeight: 600,
                            fontSize: '18px',
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-paper-plane'} me-2`}></i>
                          {loading ? 'Sending...' : 'Send Message'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="col-lg-5">
              <div className="mb-4">
                <h2 className="mb-4 fw-bold" style={{ color: '#333' }}>
                  Get in Touch
                </h2>
                <p className="text-muted fs-5 mb-4">
                  We're here to help and answer any question you might have. We look forward to hearing from you!
                </p>
              </div>

              <div className="card border-0 shadow-sm mb-4" style={{ 
                background: 'linear-gradient(135deg, #616f39 0%, #4a5630 100%)',
                color: 'white'
              }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div style={{ 
                      width: '50px', 
                      height: '50px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px'
                    }}>
                      <i className="fas fa-envelope fa-lg"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Email Us</h5>
                      <p className="mb-0">support@elibrary.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4" style={{ 
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                color: 'white'
              }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div style={{ 
                      width: '50px', 
                      height: '50px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px'
                    }}>
                      <i className="fas fa-phone fa-lg"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Call Us</h5>
                      <p className="mb-0">+91 9651220189</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-4" style={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white'
              }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div style={{ 
                      width: '50px', 
                      height: '50px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px'
                    }}>
                      <i className="fas fa-map-marker-alt fa-lg"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Visit Us</h5>
                      <p className="mb-0">226008 Library Street, Lucknow City</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm" style={{ 
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white'
              }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div style={{ 
                      width: '50px', 
                      height: '50px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px'
                    }}>
                      <i className="fas fa-clock fa-lg"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Working Hours</h5>
                      <p className="mb-0">24/7 Online Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: '#333' }}>Frequently Asked Questions</h2>
            <p className="text-muted">Quick answers to questions you may have</p>
          </div>
          
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item border-0 shadow-sm mb-3">
                  <h2 className="accordion-header">
                    <button className="accordion-button fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                      <i className="fas fa-question-circle me-3" style={{ color: '#667eea' }}></i>
                      How do I create an account?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-muted">
                      Click on the "Signup" button in the navigation bar, fill in your details, and you'll have instant access to our library.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 shadow-sm mb-3">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                      <i className="fas fa-question-circle me-3" style={{ color: '#667eea' }}></i>
                      Is E-Library really free?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-muted">
                      Yes! All our resources are completely free. We believe in making knowledge accessible to everyone without any barriers.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 shadow-sm mb-3">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                      <i className="fas fa-question-circle me-3" style={{ color: '#667eea' }}></i>
                      Can I download books?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-muted">
                      Currently, you can read books online. We're working on adding download functionality for offline reading.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 shadow-sm">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                      <i className="fas fa-question-circle me-3" style={{ color: '#667eea' }}></i>
                      How can I request a book?
                    </button>
                  </h2>
                  <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-muted">
                      Use the contact form above to send us your book request. We'll do our best to add it to our collection.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Contact
