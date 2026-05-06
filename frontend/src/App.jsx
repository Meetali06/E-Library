import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import BookOpen from './pages/BookOpen'
import BookThinkAndGrowRich from './pages/BookThinkAndGrowRich'
import BookGiveAndTake from './pages/BookGiveAndTake'
import ResistingHappiness from './pages/ResistingHappiness'
import ThreeMistakes from './pages/ThreeMistakes'
import WingsOfFire from './pages/WingsOfFire'
import OneIndianGirl from './pages/OneIndianGirl'
import TheTriumphantChurch from './pages/TheTriumphantChurch'
import DigitalColourGraphic from './pages/DigitalColourGraphic'
import MathsPuzzleBook from './pages/MathsPuzzleBook'
import TheArtOfWork from './pages/TheArtOfWork'
import HowToStopWorrying from './pages/HowToStopWorrying'
import MysteryShortStory from './pages/MysteryShortStory'
import AtomicHabits from './pages/AtomicHabits'
import TheAlchemist from './pages/TheAlchemist'
import QuietPowerIntroverts from './pages/QuietPowerIntroverts'
import PowerOfSubconscious from './pages/PowerOfSubconscious'
import TheKiteRunner from './pages/TheKiteRunner'
import TwoStates from './pages/TwoStates'
import SteveJobs from './pages/SteveJobs'
import MyExperimentsTruth from './pages/MyExperimentsTruth'
import SherlockHolmes from './pages/SherlockHolmes'
import GoneGirl from './pages/GoneGirl'
import DrawingForBeginners from './pages/DrawingForBeginners'
import WorldOfMagic from './pages/WorldOfMagic'
import BriefHistoryTime from './pages/BriefHistoryTime'
import ElegantUniverse from './pages/ElegantUniverse'
import MansSearchMeaning from './pages/MansSearchMeaning'
import Meditations from './pages/Meditations'
import BeyondGoodAndEvil from './pages/BeyondGoodAndEvil'
import PridePrejudice from './pages/PridePrejudice'
import TheNotebook from './pages/TheNotebook'
import Sapiens from './pages/Sapiens'
import DiaryYoungGirl from './pages/DiaryYoungGirl'
import TheShining from './pages/TheShining'
import Dracula from './pages/Dracula'
import RumiPoems from './pages/RumiPoems'
import MilkAndHoney from './pages/MilkAndHoney'
import ZeroToOne from './pages/ZeroToOne'
import IntelligentInvestor from './pages/IntelligentInvestor'
import WhyWeSleep from './pages/WhyWeSleep'
import BornToRun from './pages/BornToRun'
import HarryPotter from './pages/HarryPotter'
import CharlottesWeb from './pages/CharlottesWeb'
import IntoTheWild from './pages/IntoTheWild'
import EatPrayLove from './pages/EatPrayLove'
import Maus from './pages/Maus'
import Watchmen from './pages/Watchmen'
import GutenbergReader from './pages/GutenbergReader'
import History from './pages/History'
import Favorites from './pages/Favorites'
import WriteBook from './pages/WriteBook'
import MyDrafts from './pages/MyDrafts'
import './App.css'

// Protected Route Component
function ProtectedRoute({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem('studentToken'))
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/index.html" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/book/rich-dad-poor-dad" element={<BookOpen />} />
      <Route path="/book/think-and-grow-rich" element={<BookThinkAndGrowRich />} />
      <Route path="/book/give-and-take" element={<BookGiveAndTake />} />
      <Route path="/book/resisting-happiness" element={<ResistingHappiness />} />
      <Route path="/book/three-mistakes" element={<ThreeMistakes />} />
      <Route path="/book/wings-of-fire" element={<WingsOfFire />} />
      <Route path="/book/one-indian-girl" element={<OneIndianGirl />} />
      <Route path="/book/triumphant-church" element={<TheTriumphantChurch />} />
      <Route path="/book/digital-colour-graphic" element={<DigitalColourGraphic />} />
      <Route path="/book/maths-puzzle" element={<MathsPuzzleBook />} />
      <Route path="/book/art-of-work" element={<TheArtOfWork />} />
      <Route path="/book/stop-worrying" element={<HowToStopWorrying />} />
      <Route path="/book/mystery-story" element={<MysteryShortStory />} />
      <Route path="/book/atomic-habits" element={<AtomicHabits />} />
      <Route path="/book/the-alchemist" element={<TheAlchemist />} />
      <Route path="/book/quiet-power-introverts" element={<QuietPowerIntroverts />} />
      <Route path="/book/power-of-subconscious" element={<PowerOfSubconscious />} />
      <Route path="/book/the-kite-runner" element={<TheKiteRunner />} />
      <Route path="/book/two-states" element={<TwoStates />} />
      <Route path="/book/steve-jobs" element={<SteveJobs />} />
      <Route path="/book/my-experiments-truth" element={<MyExperimentsTruth />} />
      <Route path="/book/sherlock-holmes" element={<SherlockHolmes />} />
      <Route path="/book/gone-girl" element={<GoneGirl />} />
      <Route path="/book/drawing-for-beginners" element={<DrawingForBeginners />} />
      <Route path="/book/world-of-magic" element={<WorldOfMagic />} />
      <Route path="/book/the-mountain-is-you" element={<WorldOfMagic />} />
      <Route path="/book/brief-history-time" element={<BriefHistoryTime />} />
      <Route path="/book/elegant-universe" element={<ElegantUniverse />} />
      <Route path="/book/mans-search-meaning" element={<MansSearchMeaning />} />
      <Route path="/book/meditations" element={<Meditations />} />
      <Route path="/book/beyond-good-and-evil" element={<BeyondGoodAndEvil />} />
      <Route path="/book/pride-prejudice" element={<PridePrejudice />} />
      <Route path="/book/the-notebook" element={<TheNotebook />} />
      <Route path="/book/sapiens" element={<Sapiens />} />
      <Route path="/book/diary-young-girl" element={<DiaryYoungGirl />} />
      <Route path="/book/the-shining" element={<TheShining />} />
      <Route path="/book/dracula" element={<Dracula />} />
      <Route path="/book/rumi-poems" element={<RumiPoems />} />
      <Route path="/book/milk-and-honey" element={<MilkAndHoney />} />
      <Route path="/book/zero-to-one" element={<ZeroToOne />} />
      <Route path="/book/intelligent-investor" element={<IntelligentInvestor />} />
      <Route path="/book/why-we-sleep" element={<WhyWeSleep />} />
      <Route path="/book/born-to-run" element={<BornToRun />} />
      <Route path="/book/harry-potter" element={<HarryPotter />} />
      <Route path="/book/charlottes-web" element={<CharlottesWeb />} />
      <Route path="/book/into-the-wild" element={<IntoTheWild />} />
      <Route path="/book/eat-pray-love" element={<EatPrayLove />} />
      <Route path="/book/maus" element={<Maus />} />
      <Route path="/book/watchmen" element={<Watchmen />} />
      <Route path="/book/gutenberg" element={<GutenbergReader />} />
      <Route path="/book/gutenberg/:id" element={<GutenbergReader />} />
      <Route path="/write-book" element={<ProtectedRoute><WriteBook /></ProtectedRoute>} />
      <Route path="/my-drafts" element={<ProtectedRoute><MyDrafts /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
