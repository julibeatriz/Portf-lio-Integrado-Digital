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
import Login from './pages/Login.jsx'
import RotaProtegida from './routes/RoutaProtegida.jsx'
import Painel from './pages/admin/Painel.jsx'
import CadastroArea from './pages/admin/CadastroArea.jsx'
import CadastroRegistro from './pages/admin/CadastroRegistro.jsx'
import GerenciarRegistros from './pages/admin/GerenciarRegistro.jsx'
import EditarRegistro from './pages/admin/EditarRegistro.jsx'
import Erro404 from './pages/Erro404.jsx'
import GerenciarAreas from './pages/admin/GerenciarArea.jsx'
import EditarArea from './pages/admin/EditarAreas.jsx'

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
        <Route path="/login" element={<Login/>}/>

        <Route path="/admin" element={<RotaProtegida> <Painel/></RotaProtegida>}/>
        <Route path="/admin/areas" element={<RotaProtegida> <CadastroArea/></RotaProtegida>}/>
        <Route path="/admin/areas/gerenciar" element={<RotaProtegida> <GerenciarAreas/></RotaProtegida>}/>
         <Route path="/admin/areas/editar/:id" element={<RotaProtegida> <EditarArea/></RotaProtegida>}/>

        <Route path="/admin/registros/cadastrar" element={<RotaProtegida> <CadastroRegistro/></RotaProtegida>}/>
        <Route path="/admin/registros" element={<RotaProtegida> <GerenciarRegistros/></RotaProtegida>}/>
        <Route path="/admin/registros/editar/:id" element={<RotaProtegida> <EditarRegistro/></RotaProtegida>}/>
        <Route path="*" element={<Erro404/>} />
      </Routes> 
    </main>  
    
    <Footer/> 
    </>
  )
}

export default App;
