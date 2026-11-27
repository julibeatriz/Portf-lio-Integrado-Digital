import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { API_URL } from "../../services/api.js"

function EditarRegistro() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [registro, setRegistro] = useState(null)
    const [areas, setAreas] = useState([])
    const [mensagem, setMensagem] = useState("")
    const [idArea, setIdArea] = useState("")
    const [bimestre, setBimestre] = useState("")
    const [secao, setSecao] = useState("")

    const secoes = [
        "Fundamentos Teóricos",
        "Participação em Sala de Aula",
        "Projetos e Trabalhos Desenvolvidos",
        "Reflexão Crítica",
        "Conexões Interdisciplinares",
        "Aprendizados da Escola para a Vida"
    ]

    const secoesBimestrais = [
        "Fundamentos Teóricos",
        "Participação em Sala de Aula",
        "Projetos e Trabalhos Desenvolvidos"
    ]

    const bimestres = [
        "1º Bimestre",
        "2º Bimestre",
        "3º Bimestre",
        "4º Bimestre"
    ]

    useEffect(() => {

        async function buscarDados() {
            try {
                const respostaRegistro = await fetch(`${API_URL}/registros/${id}`)

                const respostaAreas = await fetch(`${API_URL}/areas`)

                if (!respostaRegistro.ok || !respostaAreas.ok) {
                    setMensagem("Erro ao buscar dados.")
                    return
                }

                const dadosRegistro = await respostaRegistro.json()
                const dadosAreas = await respostaAreas.json()

                setRegistro(dadosRegistro)
                setAreas(dadosAreas)
                setIdArea(String(dadosRegistro.id_area))
                setBimestre(dadosRegistro.bimestre || "")
                setSecao(dadosRegistro.secao)

            } catch (error) {
                console.log(error)
                setMensagem("Erro ao conectar com o servidor.")
            }
        }

        buscarDados()

    }, [id])

    const areaSelecionada = areas.find(
        area => String(area.id_area) === idArea
    )

    const instituicao = areaSelecionada?.instituicao

    const exigeBimestre = instituicao === "Sesi" && secoesBimestrais.includes(secao)

    const permiteEvidencias =
        secao === "Participação em Sala de Aula" ||
        secao === "Projetos e Trabalhos Desenvolvidos"

    async function atualizar(event) {
        event.preventDefault()
        setMensagem("")

        const formData = new FormData(event.currentTarget)
        const token = sessionStorage.getItem("token")

        if (!exigeBimestre) {
            formData.delete("bimestre")
        }

        if (!formData.get("aprendizado").trim()) {
            formData.delete("aprendizado")
        }

        if (!permiteEvidencias) {

            if (registro.evidencia_visual?.length) {
                setMensagem("Não é possível alterar para uma seção que não permite evidências enquanto houver arquivos cadastrados.")
                return
            }

            formData.delete("evidencia_visual")
        }

        try {
            const response = await fetch(`${API_URL}/registros/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            })

            if (response.status === 401) {
                sessionStorage.removeItem("token")
                navigate("/login")
                return
            }

            const dados = await response.json()

            if (!response.ok) {
                setMensagem(dados.message || "Erro ao atualizar.")
                return
            }

            navigate("/admin/registros")

        } catch (error) {
            setMensagem("Erro ao conectar com o servidor.")
        }
    }

    if (!registro) {
        return <p>{mensagem || "Carregando registro..."}</p>
    }

    return (
        <div className="cadastro-admin">

            <section className="portfolio-apresentacao">

                <Link to="/admin/registros" className="voltar">← Voltar ao gerenciamento </Link>

                <h1>Editar registro</h1>

                <p>Atualize as informações do seu registro.</p>

            </section>

            <form
                key={registro.id_registro}
                className="form-admin"
                onSubmit={atualizar}
            >

                <label htmlFor="area">Área de conhecimento</label>

                <select
                    id="area"
                    name="id_area"
                    value={idArea}
                    onChange={event => {
                        setIdArea(event.target.value)

                        const novaArea = areas.find(
                            area => String(area.id_area) === event.target.value
                        )

                        if (novaArea?.instituicao === "Senai") {
                            setBimestre("")
                        }
                    }}
                    required
                >
                    {areas.map(area => (
                        <option key={area.id_area} value={area.id_area}> {area.instituicao} - {area.nome} </option>
                    ))}
                </select>

                <label htmlFor="secao">Seção</label>

                <select
                    id="secao"
                    name="secao"
                    value={secao}
                    onChange={event => {
                        setSecao(event.target.value)

                        if (!secoesBimestrais.includes(event.target.value)) {
                            setBimestre("")
                        }
                    }}
                    required
                >
                    {secoes.map(item => ( <option key={item} value={item}> {item} </option> ))}
                </select>

                {exigeBimestre && (
                    <>
                        <label htmlFor="bimestre">Bimestre</label>

                        <select
                            id="bimestre"
                            name="bimestre"
                            value={bimestre}
                            onChange={event => setBimestre(event.target.value)}
                            required
                        >
                            <option value="">Selecione o bimestre</option>

                            {bimestres.map(item => ( <option key={item} value={item}> {item}</option>))}
                        </select>
                    </>
                )}

                <label htmlFor="titulo">Título</label>

                <input
                    id="titulo"
                    type="text"
                    name="titulo"
                    defaultValue={registro.titulo}
                    minLength={3}
                    maxLength={200}
                    required
                />

                <label htmlFor="descricao">Descrição da atividade</label>

                <textarea
                    id="descricao"
                    name="descricao"
                    defaultValue={registro.descricao}
                    rows={5}
                    minLength={5}
                    maxLength={1000}
                    required
                />

                <label htmlFor="aprendizado">Aprendizado adquirido</label>

                <textarea
                    id="aprendizado"
                    name="aprendizado"
                    defaultValue={registro.aprendizado || ""}
                    rows={5}
                    minLength={10}
                    maxLength={1200}
                />

                {permiteEvidencias && (
                    <>
                        <label>Evidências atuais</label>

                        <div className="arquivos-atuais">

                            {(registro.evidencia_visual || []).map(arquivo => (
                                <a
                                    key={arquivo}
                                    href={`http://localhost:3333/public/${encodeURIComponent(arquivo)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {arquivo}
                                </a>
                            ))}

                            {!registro.evidencia_visual?.length && ( <p>Nenhuma evidência cadastrada.</p> )}

                        </div>

                        <label htmlFor="evidencias">Novas evidências</label>

                        <input
                            key={secao}
                            id="evidencias"
                            type="file"
                            name="evidencia_visual"
                            accept=".jpg,.jpeg,.png,.webp,.pdf,.docx,.pptx,.xlsx"
                            multiple
                        />

                        <p className="aviso-arquivos"> Os novos arquivos substituirão as evidências atuais. Deixe vazio para manter os arquivos existentes. </p>
                    </>
                )}

                {mensagem && (<p className="mensagem-admin" role="status">{mensagem}</p>)}

                <button type="submit">Salvar alterações</button>

            </form>

        </div>
    )
}

export default EditarRegistro