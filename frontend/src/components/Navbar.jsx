import { Link } from "react-router-dom"

function Navbar() {
    return (
        <header className="navbar">
            <Link to="/" className="logo">
                Portfólio Integrado Digital
            </Link>

            <nav className="menu">
                <Link to="/">Início</Link>
                <Link to="/sobre">Quem Sou Eu</Link>
                <Link to="/sesi">SESI</Link>
                <Link to="/senai">SENAI</Link>
                <Link to="/login" className="botao-login">
                    Login
                </Link>
            </nav>
        </header>
    )
}

export default Navbar