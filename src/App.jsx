import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Documents from './pages/Documents'
import LldLab from './pages/LldLab'
import Dsa from './pages/Dsa'
import Jobs from './pages/Jobs'

function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/lld" element={<LldLab />} />
          <Route path="/dsa" element={<Dsa />} />
          <Route path="/jobs" element={<Jobs />} />
          
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App