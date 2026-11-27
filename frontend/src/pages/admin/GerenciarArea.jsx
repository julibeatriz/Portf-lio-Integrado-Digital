import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_URL } from "../../services/api.js"

function GerenciarAreas() {

    const [areas, setAreas] = useState([])
    const [pesquisa, setPesquisa] = useState("")
    const [mensagem, setMensagem] = useState("")

    const navigate = useNavigate()

    async function buscarAreas() {
        try {
            const response = await fetch(`${API_URL}/areas`)

            if (!response.ok) {
                setMensagem("Erro ao buscar áreas")
                return
            }

            const dados = await response.json()
            setAreas(dados)

        } catch (error) {
            setMensagem("Erro ao conectar com o servidor")
        }
    }

    useEffect(() => {
        buscarAreas()
    }, [])

   async function excluirArea(id) {

    if (!window.confirm("Deseja excluir esta área?")) {
        return
    }

    const token = sessionStorage.getItem("token")

    try {
        const response = await fetch(`${API_URL}/areas/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log("Status:", response.status)

        const dados = await response.json()

        console.log("Resposta:", dados)

        if (response.status === 401) {
            sessionStorage.removeItem("token")
            navigate("/login")
            return
        }

        if (!response.ok) {
            setMensagem(dados.message || "Erro ao excluir área")
            return
        }

        setMensagem("Área excluída com sucesso!")
        await buscarAreas()

    } catch (error) {
        console.log(error)
        setMensagem("Erro ao excluir área")
    }
}

    const areasFiltradas = areas.filter(area =>
        area.nome.toLowerCase().includes(pesquisa.toLowerCase())
    )

    return (
        <div className="gerenciar-areas">

            <section className="portfolio-apresentacao">

                <Link to="/admin" className="voltar">Voltar ao painel</Link>

                <h1>Gerenciar áreas</h1>

                <p>Visualize, edite e exclua as áreas cadastradas.</p>

            </section>

            <section className="registros-academicos">

                <div className="barra-gerenciamento">

                    <input
                        type="text"
                        placeholder="Pesquisar área..."
                        value={pesquisa}
                        onChange={event => setPesquisa(event.target.value)}
                    />

                    <Link to="/admin/areas" className="botao-home"> Nova área</Link>

                </div>

                {mensagem && (
                    <p className="mensagem-admin">{mensagem}</p>
                )}

                <div className="lista-registros">

                    {areasFiltradas.map(area => (

                        <div className="card-registro" key={area.id_area}>

                            <span>{area.instituicao}</span>

                            <h3>{area.nome}</h3>

                            <p>{area.descricao}</p>

                            <div className="acoes-registro">

                                <Link to={`/admin/areas/editar/${area.id_area}`} className="botao-editar"> Editar</Link>

                                <button className="botao-excluir" onClick={() => excluirArea(area.id_area)}> Excluir </button>

                            </div>

                        </div>

                    ))}

                </div>

            </section>

        </div>
    )
}

export default GerenciarAreas;