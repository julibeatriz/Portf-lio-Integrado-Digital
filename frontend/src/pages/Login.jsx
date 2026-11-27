import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_URL } from "../services/api.js"

function Login() {

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")
    const [mostrarSenha, setMostrarSenha] = useState(false)

    const navigate = useNavigate()

    async function entrar(event) {
        event.preventDefault()
        setErro("")

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    senha
                })
            })

            const dados = await response.json()

            if (!response.ok) {
                setErro(dados.message || "Erro ao realizar login.")
                return
            }

            sessionStorage.setItem("token", dados.token)

            navigate("/admin")

        } catch (error) {
            console.log(error)
            setErro("Não foi possível conectar ao servidor.")
        }
    }

    return (
        <div className="login">

            <form className="form-login" onSubmit={entrar}>

                <h1>Área administrativa</h1>

                <p>
                    Entre com suas credenciais para
                    gerenciar o portfólio.
                </p>

                <label htmlFor="email">E-mail</label>

                <input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    required
                />

                <label htmlFor="senha">Senha</label>

                <input
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={event => setSenha(event.target.value)}
                    required
                />

                <button
                    type="button"
                    className="mostrar-senha"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                    {mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                </button>

                {erro && <p className="erro-login">{erro}</p>}

                <button type="submit" className="entrar">
                    Entrar
                </button>

                <Link to="/" className="voltar-login">
                    ← Voltar ao portfólio
                </Link>

            </form>

        </div>
    )
}

export default Login