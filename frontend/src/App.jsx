import './App.css'
import { Routes, Route } from "react-router-dom"
import Home from './pages/home.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import SobreMin from './pages/SobreMim.jsx'
import Sesi from './pages/Sesi.jsx'
import Senai from './pages/Senai.jsx'
import Area from './pages/area.jsx'
import Secao from './pages/Secao.jsx'
import Registro from './pages/Registro.jsx'

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
        <Route path="/area/:id/secao/:secao" element={<Secao/>}/>
        <Route path="/registro/:id" element={<Registro/>}/>
      </Routes> 
    </main>  
    
    <Footer/> 
    </>
  )
}

export default App
