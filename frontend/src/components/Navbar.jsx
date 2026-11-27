import { Link, useLocation, useNavigate } from "react-router-dom"

function Navbar() {

    useLocation()

    const navigate = useNavigate()
    const token = sessionStorage.getItem("token")

    function logout() {
    sessionStorage.removeItem("token")
    navigate("/login")
    }

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
                    <button className="botao-login" onClick={logout}>
                        Logout
                    </button>
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