import './App.css'
import { Routes, Route } from "react-router-dom"
import Home from './pages/home.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import SobreMin from './pages/SobreMim.jsx'
import Sesi from './pages/Sesi.jsx'
import Senai from './pages/Senai.jsx'
import Area from './pages/area.jsx'

function App() {
  return (
    <>
    <Navbar/>
    
    <main>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sobre" element={<SobreMin/>}/>
        <Route path="/sesi" element={<Sesi/>}/>
        <Route path="/senai" element={<Senai/>}/>
        <Route path="/area/:id" element={<Area/>}/>
      </Routes> 
    </main>  
    
    <Footer/> 
    </>
  )
}

export default App
