import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { API_URL } from "../../services/api.js"

function EditarArea() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [area, setArea] = useState(null)
    const [mensagem, setMensagem] = useState("")

    useEffect(() => {

        async function buscarArea() {
            try {
                const response = await fetch(`${API_URL}/areas/${id}`)

                if (!response.ok) {
                    setMensagem("Erro ao buscar área")
                    return
                }

                const dados = await response.json()
                setArea(dados)

            } catch (error) {
                setMensagem("Erro ao conectar com o servidor")
            }
        }

        buscarArea()

    }, [id])

    async function atualizarArea(event) {

        event.preventDefault()

        const token = sessionStorage.getItem("token")

        try {
            const response = await fetch(`${API_URL}/areas/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
                body: JSON.stringify({
                    instituicao: area.instituicao,
                    nome: area.nome,
                    descricao: area.descricao
                })
            })

            if (response.status === 401) {
                sessionStorage.removeItem("token")
                navigate("/login")
                return
            }

            const dados = await response.json()

            if (!response.ok) {
                setMensagem(dados.message)
                return
            }

            navigate("/admin/areas/gerenciar")

        } catch (error) {
            setMensagem("Erro ao atualizar área")
        }
    }

    if (!area) {
        return <p>{mensagem || "Carregando..."}</p>
    }

    return (
        <div className="cadastro-admin">

            <section className="portfolio-apresentacao">

                <Link to="/admin/areas/gerenciar" className="voltar"> Voltar </Link>

                <h1>Editar área</h1>

                <p>Atualize as informações da área de conhecimento.</p>

            </section>

            <form className="form-admin" onSubmit={atualizarArea}>

                <label htmlFor="instituicao">Instituição</label>

                <select
                    id="instituicao"
                    value={area.instituicao}
                    onChange={event => setArea({
                        ...area,
                        instituicao: event.target.value
                    })}
                    required
                >
                    <option value="Sesi">SESI</option>
                    <option value="Senai">SENAI</option>
                </select>

                <label htmlFor="nome">Nome da área</label>

                <input
                    id="nome"
                    type="text"
                    value={area.nome}
                    onChange={event => setArea({
                        ...area,
                        nome: event.target.value
                    })}
                    required
                />

                <label htmlFor="descricao">Descrição</label>

                <textarea
                    id="descricao"
                    rows="5"
                    value={area.descricao || ""}
                    onChange={event => setArea({
                        ...area,
                        descricao: event.target.value
                    })}
                />

                {mensagem && (<p className="mensagem-admin">{mensagem}</p>)}

                <button type="submit"> Salvar alterações </button>

            </form>

        </div>
    )
}

export default EditarArea;