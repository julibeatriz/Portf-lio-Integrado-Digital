import './App.css'
import { Routes, Route } from "react-router-dom"
import Home from './pages/home.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import SobreMin from './pages/SobreMim.jsx'

function App() {
  return (
    <>
    <Navbar/>
    
    <main>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sobre" element={<SobreMin/>}/>
      </Routes> 
    </main>  
    
    <Footer/> 
    </>
  )
}

export default App
