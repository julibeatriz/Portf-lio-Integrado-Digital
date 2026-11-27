import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_URL } from "../../services/api.js"

function GerenciarRegistros() {

    const [registros, setRegistros] = useState([])
    const [pesquisa, setPesquisa] = useState("")
    const [mensagem, setMensagem] = useState("")

    const navigate = useNavigate()

    async function buscarRegistros() {
        try {
            const response = await fetch(`${API_URL}/registros`)

            if (!response.ok) {
                setMensagem("Erro ao buscar registros.")
                return
            }

            const dados = await response.json()
            setRegistros(dados)

        } catch (error) {
            setMensagem("Erro ao conectar com o servidor.")
        }
    }

    useEffect(() => {
        buscarRegistros()
    }, [])

    async function excluirRegistro(id) {

        const confirmar = window.confirm("Deseja realmente excluir esse registro?" )

        if (!confirmar) {
            return
        }

        const token = sessionStorage.getItem("token")

        try {
            const response = await fetch(
                `${API_URL}/registros/${id}`, {
                    method: "DELETE",
                    headers: {Authorization: `Bearer ${token}`}
                }
            )

            if (response.status === 401) {
                sessionStorage.removeItem("token")
                navigate("/login")
                return
            }

            if (!response.ok) {
                setMensagem("Erro ao excluir registro.")
                return
            }

            setMensagem("Registro excluído com sucesso!")
            buscarRegistros()

        } catch (error) {
            setMensagem("Erro ao conectar com o servidor.")
        }
    }

    const registrosFiltrados = registros.filter(registro =>
        registro.titulo.toLowerCase().includes(
            pesquisa.toLowerCase()
        )
    )

    return (
        <div className="gerenciar-registros">

            <section className="portfolio-apresentacao">

                <Link to="/admin" className="voltar">← Voltar ao painel </Link>

                <h1>Gerenciar registros</h1>

                <p> Visualize e gerencie suas atividades acadêmicas. </p>

            </section>

            <section className="registros-academicos">

                <div className="barra-gerenciamento">

                    <input
                        type="search"
                        placeholder="Pesquisar pelo título..."
                        aria-label="Pesquisar pelo título"
                        value={pesquisa}
                        onChange={event =>
                            setPesquisa(event.target.value)
                        }
                    />

                    <Link to="/admin/registros/cadastrar" className="botao-home"> + Novo registro</Link>

                </div>

                {mensagem && ( <p className="mensagem-admin" role="status"> {mensagem}</p> )}

                <div className="lista-registros">

                    {registrosFiltrados.length === 0 && ( <p className="sem-registros"> Nenhum registro encontrado.</p>)}

                    {registrosFiltrados.map(registro => (

                        <div className="card-registro" key={registro.id_registro} >

                            <span> {registro.bimestre} | {registro.secao} </span>

                            <h3>{registro.titulo}</h3>

                            <div className="acoes-registro">

                                <Link to={`/registro/${registro.id_registro}`} className="botao-visualizar"> Visualizar </Link>

                                <Link to={`/admin/registros/editar/${registro.id_registro}`} className="botao-editar" > Editar </Link>

                                <button className="botao-excluir" onClick={() => excluirRegistro(registro.id_registro)}> Excluir </button>

                            </div>

                        </div>

                    ))}

                </div>

            </section>

        </div>
    )
}

export default GerenciarRegistros;