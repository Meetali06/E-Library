import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SearchBar from '../components/SearchBar'
import AuthModal from '../components/AuthModal'
import './Home.css'

const API_BASE = import.meta.env.VITE_API_URL

const heroSlides = [
  { img: '/images/bgimage.png', alt: 'Welcome to E-Library' },
  { img: '/images/image.png', alt: 'Smart Reading Starts Here' },
  { img: '/images/a world of reading .jpeg', alt: 'A World of Reading, Always Within Reach' },
  { img: '/images/knowledge at fingertips.jpeg', alt: 'Knowledge at Your Fingertips' },
]

function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [dynamicBooks, setDynamicBooks] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const timerRef = useRef(null)

  // Make showAuthModal globally accessible for Navbar
  window.showAuthModal = (type) => setShowAuthModal(true)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length)
    }, 4000)
  }, [])

  useEffect(() => {
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [resetTimer])

  const goToSlide = (dir) => {
    setCurrentSlide(prev => {
      if (dir === 'next') return (prev + 1) % heroSlides.length
      return (prev - 1 + heroSlides.length) % heroSlides.length
    })
    resetTimer()
  }

  useEffect(() => {
    axios.get(`${API_BASE}/api/books`)
      .then(res => setDynamicBooks(res.data.books || []))
      .catch(() => {})
  }, [])

  // ── Handle category scroll on hash change ────────────────────────────────────
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.slice(1)
      if (hash) {
        const element = document.getElementById(hash)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 100)
        }
      }
    }

    handleHashScroll()
    window.addEventListener('hashchange', handleHashScroll)
    return () => window.removeEventListener('hashchange', handleHashScroll)
  }, [])

  const getBooksByCategory = (category) => {
    return dynamicBooks.filter(book => book.category === category)
  }

  const renderDynamicBooks = (category) => {
    const books = getBooksByCategory(category)
    if (books.length === 0) return null
    return books.map(book => (
      <div className="col-md-4" key={book._id}>
        <div className="thumbnail">
          {book.pdfUrl ? (
            <a href={`${API_BASE}${book.pdfUrl}`} target="_blank" rel="noopener noreferrer">
              <img
                src={book.imageUrl ? `${API_BASE}${book.imageUrl}` : '/images/default-book.png'}
                alt={book.title}
                style={{ width: '50%' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="caption">
                <p><strong>{book.title}</strong><br />{book.author && <>by {book.author}<br /></>}{book.description}</p>
              </div>
            </a>
          ) : (
            <div>
              <img
                src={book.imageUrl ? `${API_BASE}${book.imageUrl}` : '/images/default-book.png'}
                alt={book.title}
                style={{ width: '50%' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="caption">
                <p><strong>{book.title}</strong><br />{book.author && <>by {book.author}<br /></>}{book.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    ))
  }

  return (
    <div>
      <Navbar />
      
      {/* Hero Carousel */}
      <div className="hero-carousel">
        <div className="hero-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {heroSlides.map((slide, i) => (
            <div className="hero-slide" key={i}>
              {slide.type === 'text' ? (
                <div className="hero-text-slide">
                  <span className="hero-particle"></span>
                  <span className="hero-particle"></span>
                  <span className="hero-particle"></span>
                  <span className="hero-particle"></span>
                  <span className="hero-particle"></span>
                  <div className="hero-text-overlay">
                    <span className="hero-text-icon">📚</span>
                    <h1>Find Your Favorite Book Right Here</h1>
                    <p>Explore thousands of books across every genre — all in one place.</p>
                  </div>
                </div>
              ) : (
                <img src={slide.img} alt={slide.alt} />
              )}
            </div>
          ))}
        </div>
        <button className="hero-arrow hero-arrow-left" onClick={() => goToSlide('prev')} aria-label="Previous slide">&#10094;</button>
        <button className="hero-arrow hero-arrow-right" onClick={() => goToSlide('next')} aria-label="Next slide">&#10095;</button>
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <span
              key={i}
              className={`hero-dot${i === currentSlide ? ' active' : ''}`}
              onClick={() => { setCurrentSlide(i); resetTimer() }}
            />
          ))}
        </div>
      </div>
      
      <br />
      
      {/* Auto-Scrolling Book Showcase */}
      <div className="book-scroller">
        <div className="book-scroller-title">Popular Books</div>
        <div className="scroller-track">
          {(() => {
            const books = [
              { img: '/images/Rich Dad Poor Dad eBook_0000.jpg', title: 'Rich Dad Poor Dad', link: '/book/rich-dad-poor-dad' },
              { img: '/images/atomic-habits.jpg', title: 'Atomic Habits', link: '/book/atomic-habits' },
              { img: '/images/the-alchemist.jpg', title: 'The Alchemist', link: '/book/the-alchemist' },
              { img: '/images/quiet-introverts.jpg', title: 'Quiet: Power of Introverts', link: '/book/quiet-power-introverts' },
              { img: '/images/kite-runner.jpg', title: 'The Kite Runner', link: '/book/the-kite-runner' },
              { img: '/images/steve-jobs.jpg', title: 'Steve Jobs', link: '/book/steve-jobs' },
              { img: '/images/sherlock-holmes.jpg', title: 'Sherlock Holmes', link: '/book/sherlock-holmes' },
              { img: '/images/gone-girl.jpg', title: 'Gone Girl', link: '/book/gone-girl' },
              { img: '/images/harry-potter.jpg', title: 'Harry Potter', link: '/book/harry-potter' },
              { img: '/images/brief-history-time.jpg', title: 'A Brief History of Time', link: '/book/brief-history-time' },
              { img: '/images/mans-search-meaning.jpg', title: "Man's Search for Meaning", link: '/book/mans-search-meaning' },
              { img: '/images/pride-prejudice.jpg', title: 'Pride and Prejudice', link: '/book/pride-prejudice' },
              { img: '/images/sapiens.jpg', title: 'Sapiens', link: '/book/sapiens' },
              { img: '/images/shining-king.jpg', title: 'The Shining', link: '/book/the-shining' },
              { img: '/images/rumi-poems.jpg', title: 'The Essential Rumi', link: '/book/rumi-poems' },
              { img: '/images/zero-to-one.jpg', title: 'Zero to One', link: '/book/zero-to-one' },
              { img: '/images/why-we-sleep.jpg', title: 'Why We Sleep', link: '/book/why-we-sleep' },
              { img: '/images/into-wild.jpg', title: 'Into the Wild', link: '/book/into-the-wild' },
              { img: '/images/watchmen.jpg', title: 'Watchmen', link: '/book/watchmen' },
              { img: '/images/mountain%20i%20su%20cover.jpg', title: 'The Mountain Is You', link: '/book/the-mountain-is-you' },
            ]
            return books.concat(books).map((book, i) => (
              <Link to={book.link} className="scroller-item" key={i}>
                <img src={book.img} alt={book.title} />
                <p>{book.title}</p>
              </Link>
            ))
          })()}
        </div>
      </div>
      
      <br />
      
      {/* Educational Section */}
      <h2 className="container category-heading" id="Educational" style={{ backgroundColor: '#f1c40f', color: '#fff' }}>Educational</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/rich-dad-poor-dad">
                <img src="/images/Rich Dad Poor Dad eBook_0000.jpg" alt="Rich Dad Poor Dad" style={{ width: '50%' }} />
                <div className="caption">
                  <p>The bestselling book to enlighten <br /> you about financial independence.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/think-and-grow-rich">
                <img src="https://m.media-amazon.com/images/I/61B84NiWabL._AC_UF1000,1000_QL80_.jpg" alt="Think and Grow Rich" style={{ width: '50%' }} />
                <div className="caption">
                  <p>Think and Grow Rich has been <br /> considered the best self-help <br />book in the world</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/give-and-take">
                <img src="https://m.media-amazon.com/images/I/51lRxELGt4L._AC_UF1000,1000_QL80_.jpg" alt="Give and Take" style={{ width: '50%' }} />
                <div className="caption">
                  <p>Give and Take: A <br />Revolutionary Approach to<br /> Success.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/atomic-habits">
                <img src="/images/atomic-habits.jpg" alt="Atomic Habits" style={{ width: '50%' }} />
                <div className="caption">
                  <p>An Easy & Proven Way to<br /> Build Good Habits & Break<br /> Bad Ones.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/the-alchemist">
                <img src="/images/the-alchemist.jpg" alt="The Alchemist" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A magical fable about<br /> following your dreams<br /> by Paulo Coelho.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Educational')}
        </div>
      </div>
      
      <hr />
      
      {/* Self-Help & Motivation Section */}
      <h2 className="container category-heading" id="SelfHelp" style={{ backgroundColor: '#2ecc71', color: '#fff' }}>Self-Help & Motivation</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/resisting-happiness">
                <img src="/images/Rh.png" alt="Resisting Happiness" style={{ width: '50%' }} />
                <div className="caption">
                  <p>Resistance to happiness and <br />provides practical strategies<br /> to overcome it.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/stop-worrying">
                <img src="/images/SL.png" alt="Stop Worrying" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A self-help book by Dale<br /> Carnegie and first printed<br /> in 1948.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/art-of-work">
                <img src="/images/ART.png" alt="Art of Work" style={{ width: '50%' }} />
                <div className="caption">
                  <p>It is vaguely described as being<br /> someone's life's work.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/quiet-power-introverts">
                <img src="/images/quiet-introverts.jpg" alt="Quiet: The Power of Introverts" style={{ width: '50%' }} />
                <div className="caption">
                  <p>The Power of Introverts<br /> in a World That Can't<br /> Stop Talking.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/power-of-subconscious">
                <img src="/images/power-subconscious.jpg" alt="The Power of Your Subconscious Mind" style={{ width: '50%' }} />
                <div className="caption">
                  <p>Unlock the secrets of your<br /> subconscious mind by<br /> Dr. Joseph Murphy.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Self-Help & Motivation')}
        </div>
      </div>
      
      <hr />
      
      {/* Fiction & Novels Section */}
      <h2 className="container category-heading" id="Fiction" style={{ backgroundColor: '#e74c3c', color: '#fff' }}>Fiction & Novels</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/three-mistakes">
                <img src="https://files.cdn-files-a.com/uploads/4624183/2000_60fd2a5816f27.jpg" alt="Three Mistakes" style={{ width: '50%' }} />
                <div className="caption">
                  <p>The 3 Mistakes of My Life is<br /> the third novel written by<br /> Chetan Bhagat.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/one-indian-girl">
                <img src="/images/indian-girls-book-covers" alt="One Indian Girl" style={{ width: '50%' }} />
                <div className="caption">
                  <p>Girl in India who have chosen<br /> career as life.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/the-kite-runner">
                <img src="/images/kite-runner.jpg" alt="The Kite Runner" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A haunting tale of friendship,<br /> betrayal, and redemption<br /> by Khaled Hosseini.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/two-states">
                <img src="/images/two-states.jpg" alt="2 States" style={{ width: '50%' }} />
                <div className="caption">
                  <p>The Story of My Marriage<br /> by Chetan Bhagat.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Fiction & Novels')}
        </div>
      </div>
      
      <hr />
      
      {/* Biography & Inspiration Section */}
      <h2 className="container category-heading" id="Biography" style={{ backgroundColor: '#3498db', color: '#fff' }}>Biography & Inspiration</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/wings-of-fire">
                <img src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1588286863i/634583.jpg" alt="Wings of Fire" style={{ width: '50%' }} />
                <div className="caption">
                  <p>"Wings of Fire: An<br /> Autobiography of<br /> Abdul Kalam".</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/triumphant-church">
                <img src="https://imgproxy2.pdfroom.com/TRy4ZuS1uSmj9GhMWQIj_cEYKUy52W2WMJgsHHemEyU/rs:auto:0:800:0/g:no/cmE1MTdYTzZnSk8ucG5n.jpg" alt="The Triumphant Church" style={{ width: '50%' }} />
                <div className="caption">
                  <p>The Triumphant Church:<br /> Dominion Over All the Powers <br />of Darkness.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/steve-jobs">
                <img src="/images/steve-jobs.jpg" alt="Steve Jobs" style={{ width: '50%' }} />
                <div className="caption">
                  <p>The exclusive biography<br /> of Steve Jobs by<br /> Walter Isaacson.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/my-experiments-truth">
                <img src="/images/gandhi-truth.jpg" alt="My Experiments with Truth" style={{ width: '50%' }} />
                <div className="caption">
                  <p>The autobiography of<br /> Mahatma Gandhi — a journey<br /> of truth and non-violence.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Biography & Inspiration')}
        </div>
      </div>
      
      <hr />
      
      {/* Mystery & Thriller Section */}
      <h2 className="container category-heading" id="Mystery" style={{ backgroundColor: '#8e44ad', color: '#fff' }}>Mystery & Thriller</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/mystery-story">
                <img src="/images/a%20collection%20of%20mysterry%20book" alt="Mystery Short Story" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A collection of gripping<br /> mystery short stories<br /> that keep you guessing.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/sherlock-holmes">
                <img src="/images/sherlock-holmes.jpg" alt="Sherlock Holmes" style={{ width: '50%' }} />
                <div className="caption">
                  <p>The complete adventures of<br /> the legendary detective by<br /> Arthur Conan Doyle.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/gone-girl">
                <img src="/images/gone-girl.jpg" alt="Gone Girl" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A brilliant thriller about<br /> the disappearance of a wife<br /> by Gillian Flynn.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Mystery & Thriller')}
        </div>
      </div>
      
      <hr />
      
      {/* Entertainment Section */}
      <h2 className="container category-heading" id="Entertainment" style={{ backgroundColor: '#e67e22', color: '#fff' }}>Entertainment</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/digital-colour-graphic">
                <img src="https://rukminim2.flixcart.com/image/850/1000/l4ei1e80/book/8/b/p/introduction-to-graphic-design-original-imagfbfkdq2gzu3s.jpeg?q=90&crop=false" alt="Digital Graphic" style={{ width: '50%' }} />
                <div className="caption">
                  <p>Complete, practical guide to<br /> handling colour graphics<br /> on the desktop.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/maths-puzzle">
                <img src="https://m.media-amazon.com/images/I/71Mp8OaKq8L._AC_UF1000,1000_QL80_.jpg" alt="Maths Puzzle" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A puzzle book is a type of<br /> activity book which<br /> contains a collection of<br /> puzzles.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/drawing-for-beginners">
                <img src="/images/drawing-beginners.jpg" alt="Drawing for Beginners" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A step-by-step guide<br /> to learn drawing<br /> from scratch.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/world-of-magic">
                <img src="/images/magic-tricks.jpg" alt="World of Magic Tricks" style={{ width: '50%' }} />
                <div className="caption">
                  <p>Learn amazing magic tricks<br /> and wow your audience.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Entertainment')}
        </div>
      </div>
      
      <hr />
      
      {/* Science & Technology Section */}
      <h2 className="container category-heading" id="Science" style={{ backgroundColor: '#1abc9c', color: '#fff' }}>Science & Technology</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/brief-history-time">
                <img src="/images/brief-history-time.jpg" alt="A Brief History of Time" style={{ width: '50%' }} />
                <div className="caption">
                  <p>From the Big Bang to<br /> Black Holes by<br /> Stephen Hawking.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/elegant-universe">
                <img src="/images/elegant-universe.jpg" alt="The Elegant Universe" style={{ width: '50%' }} />
                <div className="caption">
                  <p>Superstrings, Hidden<br /> Dimensions, and the Quest<br /> for the Ultimate Theory.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Science & Technology')}
        </div>
      </div>
      
      <hr />
      
      {/* Philosophy & Psychology Section */}
      <h2 className="container category-heading" id="Philosophy" style={{ backgroundColor: '#34495e', color: '#fff' }}>Philosophy & Psychology</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/mans-search-meaning">
                <img src="/images/mans-search-meaning.jpg" alt="Man's Search for Meaning" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A profound memoir and<br /> guide to finding purpose<br /> by Viktor E. Frankl.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/meditations">
                <img src="/images/meditations-aurelius.jpg" alt="Meditations" style={{ width: '50%' }} />
                <div className="caption">
                  <p>Timeless wisdom from<br /> Roman Emperor<br /> Marcus Aurelius.</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/beyond-good-and-evil">
                <img src="/images/beyond evil and good" alt="Beyond Good and Evil" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A groundbreaking philosophical<br /> work by Friedrich Nietzsche<br /> on morality and values.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Philosophy & Psychology')}
        </div>
      </div>
      
      <hr />
      
      {/* Romance Section */}
      <h2 className="container category-heading" id="Romance" style={{ backgroundColor: '#e91e63', color: '#fff' }}>Romance</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/pride-prejudice">
                <img src="/images/pride-prejudice.jpg" alt="Pride and Prejudice" style={{ width: '50%' }} />
                <div className="caption">
                  <p>The classic tale of love<br /> and social standing<br /> by Jane Austen.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/the-notebook">
                <img src="/images/notebook-sparks.jpg" alt="The Notebook" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A timeless love story<br /> by Nicholas Sparks.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Romance')}
        </div>
      </div>
      
      <hr />
      
      {/* History & Politics Section */}
      <h2 className="container category-heading" id="History" style={{ backgroundColor: '#795548', color: '#fff' }}>History & Politics</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/sapiens">
                <img src="/images/sapiens.jpg" alt="Sapiens" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A Brief History of<br /> Humankind by<br /> Yuval Noah Harari.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/diary-young-girl">
                <img src="/images/diary-young-girl.jpg" alt="The Diary of a Young Girl" style={{ width: '50%' }} />
                <div className="caption">
                  <p>The moving diary of<br /> Anne Frank written<br /> during the Holocaust.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('History & Politics')}
        </div>
      </div>
      
      <hr />
      
      {/* Horror & Supernatural Section */}
      <h2 className="container category-heading" id="Horror" style={{ backgroundColor: '#212121', color: '#fff' }}>Horror & Supernatural</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/the-shining">
                <img src="/images/shining-king.jpg" alt="The Shining" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A terrifying tale of<br /> isolation and madness<br /> by Stephen King.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/dracula">
                <img src="/images/dracula.jpg" alt="Dracula" style={{ width: '50%' }} />
                <div className="caption">
                  <p>The classic Gothic horror<br /> novel by Bram Stoker.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Horror & Supernatural')}
        </div>
      </div>
      
      <hr />
      
      {/* Poetry & Literature Section */}
      <h2 className="container category-heading" id="Poetry" style={{ backgroundColor: '#9c27b0', color: '#fff' }}>Poetry & Literature</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/rumi-poems">
                <img src="/images/rumi-poems.jpg" alt="The Essential Rumi" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A collection of mystical<br /> poetry translated by<br /> Coleman Barks.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/milk-and-honey">
                <img src="/images/milk-honey.jpg" alt="Milk and Honey" style={{ width: '50%' }} />
                <div className="caption">
                  <p>Poetry about survival,<br /> love, and femininity<br /> by Rupi Kaur.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Poetry & Literature')}
        </div>
      </div>
      
      <hr />
      
      {/* Business & Finance Section */}
      <h2 className="container category-heading" id="Business" style={{ backgroundColor: '#ff5722', color: '#fff' }}>Business & Finance</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/zero-to-one">
                <img src="/images/zero-to-one.jpg" alt="Zero to One" style={{ width: '50%' }} />
                <div className="caption">
                  <p>Notes on Startups, or How<br /> to Build the Future<br /> by Peter Thiel.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/intelligent-investor">
                <img src="/images/intelligent-investor.jpg" alt="The Intelligent Investor" style={{ width: '50%' }} />
                <div className="caption">
                  <p>The definitive book on<br /> value investing by<br /> Benjamin Graham.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Business & Finance')}
        </div>
      </div>
      
      <hr />
      
      {/* Health & Wellness Section */}
      <h2 className="container category-heading" id="Health" style={{ backgroundColor: '#4caf50', color: '#fff' }}>Health & Wellness</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/why-we-sleep">
                <img src="/images/why-we-sleep.jpg" alt="Why We Sleep" style={{ width: '50%' }} />
                <div className="caption">
                  <p>Unlocking the Power of<br /> Sleep and Dreams by<br /> Matthew Walker.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/born-to-run">
                <img src="/images/born-to-run.jpg" alt="Born to Run" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A Hidden Tribe,<br /> Superathletes, and the<br /> Greatest Race.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Health & Wellness')}
        </div>
      </div>
      
      <hr />
      
      {/* Children & Young Adults Section */}
      <h2 className="container category-heading" id="Children" style={{ backgroundColor: '#00bcd4', color: '#fff' }}>Children & Young Adults</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/harry-potter">
                <img src="/images/harry-potter.jpg" alt="Harry Potter" style={{ width: '50%' }} />
                <div className="caption">
                  <p>The magical beginning<br /> of the wizarding world<br /> by J.K. Rowling.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/charlottes-web">
                <img src="/images/charlotte-web.jpg" alt="Charlotte's Web" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A beloved children's classic<br /> about friendship<br /> by E.B. White.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Children & Young Adults')}
        </div>
      </div>
      
      <hr />
      
      {/* Travel & Adventure Section */}
      <h2 className="container category-heading" id="Travel" style={{ backgroundColor: '#ff9800', color: '#fff' }}>Travel & Adventure</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/into-the-wild">
                <img src="/images/into-wild.jpg" alt="Into the Wild" style={{ width: '50%' }} />
                <div className="caption">
                  <p>The true story of<br /> Christopher McCandless<br /> by Jon Krakauer.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/eat-pray-love">
                <img src="/images/eat-pray-love.jpg" alt="Eat, Pray, Love" style={{ width: '50%' }} />
                <div className="caption">
                  <p>One Woman's Search for<br /> Everything by<br /> Elizabeth Gilbert.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Travel & Adventure')}
        </div>
      </div>
      
      <hr />
      
      {/* Comics & Graphic Novels Section */}
      <h2 className="container category-heading" id="Comics" style={{ backgroundColor: '#607d8b', color: '#fff' }}>Comics & Graphic Novels</h2>
      <br />
      
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/maus">
                <img src="/images/maus.jpg" alt="Maus" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A Pulitzer Prize-winning<br /> graphic novel about<br /> the Holocaust.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="thumbnail">
              <Link to="/book/watchmen">
                <img src="/images/watchmen.jpg" alt="Watchmen" style={{ width: '50%' }} />
                <div className="caption">
                  <p>A groundbreaking graphic<br /> novel by Alan Moore<br /> and Dave Gibbons.</p>
                </div>
              </Link>
            </div>
          </div>
          {renderDynamicBooks('Comics & Graphic Novels')}
        </div>
      </div>
      
      <br /><br />
      
      <Footer />
      
      <AuthModal show={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}

export default Home
