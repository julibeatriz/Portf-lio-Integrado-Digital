import { Link, useLocation } from "react-router-dom"

function Navbar() {

    useLocation()

    const token = sessionStorage.getItem("token")

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

                {token ? (
                    <Link to="/admin" className="botao-login">
                        Painel Administrativo
                    </Link>
                ) : (
                    <Link to="/login" className="botao-login">
                        Login
                    </Link>
                )}

            </nav>

        </header>
    )
}

export default Navbar