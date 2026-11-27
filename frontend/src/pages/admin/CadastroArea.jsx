import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_URL } from "../../services/api.js"

function CadastroArea() {

    const [instituicao, setInstituicao] = useState("")
    const [nome, setNome] = useState("")
    const [descricao, setDescricao] = useState("")
    const [mensagem, setMensagem] = useState("")

    const navigate = useNavigate()

    async function cadastrar(event) {
        event.preventDefault()
        setMensagem("")

        const token = sessionStorage.getItem("token")

        try {
            const response = await fetch(`${API_URL}/areas`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
                body: JSON.stringify({
                    instituicao,
                    nome,
                    descricao
                })
            })

            const dados = await response.json()

            if (response.status === 401) {
                sessionStorage.removeItem("token")
                navigate("/login")
                return
            }

            if (!response.ok) {
                setMensagem(dados.message || "Erro ao cadastrar área.")
                return
            }

            setMensagem("Área cadastrada com sucesso!")

            setInstituicao("")
            setNome("")
            setDescricao("")

        } catch (error) {
            console.log(error)
            setMensagem("Erro ao conectar com o servidor.")
        }
    }

    return (
        <div className="cadastro-admin">

            <section className="portfolio-apresentacao">

                <Link to="/admin" className="voltar">
                    ← Voltar ao painel
                </Link>

                <h1>Cadastrar área</h1>

                <p>
                    Adicione uma nova área de conhecimento
                    ao portfólio.
                </p>

            </section>

            <form className="form-admin" onSubmit={cadastrar}>

                <label htmlFor="instituicao">Instituição</label>

                <select
                    id="instituicao"
                    value={instituicao}
                    onChange={event => setInstituicao(event.target.value)}
                    required
                >
                    <option value="">Selecione a instituição</option>
                    <option value="Sesi">SESI</option>
                    <option value="Senai">SENAI</option>
                </select>

                <label htmlFor="nome">Nome da área</label>

                <input
                    id="nome"
                    type="text"
                    placeholder="Ex.: Matemática"
                    value={nome}
                    onChange={event => setNome(event.target.value)}
                    required
                />

                <label htmlFor="descricao">Descrição</label>

                <textarea
                    id="descricao"
                    placeholder="Descreva a área de conhecimento"
                    value={descricao}
                    onChange={event => setDescricao(event.target.value)}
                    rows={5}
                />

                {mensagem && (
                    <p className="mensagem-admin" role="status">
                        {mensagem}
                    </p>
                )}

                <button type="submit">
                    Cadastrar área
                </button>

            </form>

        </div>
    )
}

export default CadastroArea;