import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_URL } from "../../services/api.js"

function CadastroRegistro() {

    const [areas, setAreas] = useState([])
    const [instituicao, setInstituicao] = useState("")
    const [idArea, setIdArea] = useState("")
    const [secao, setSecao] = useState("")
    const [bimestre, setBimestre] = useState("")
    const [titulo, setTitulo] = useState("")
    const [descricao, setDescricao] = useState("")
    const [aprendizado, setAprendizado] = useState("")
    const [reflexaoPratica, setReflexaoPratica] = useState("")
    const [autoavaliacao, setAutoavaliacao] = useState("")
    const [melhoriasNecessarias, setMelhoriasNecessarias] = useState("")
    const [arquivos, setArquivos] = useState([])
    const [mensagem, setMensagem] = useState("")

    const navigate = useNavigate()

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

        async function buscarAreas() {
            try {
                const response = await fetch(`${API_URL}/areas`)

                if (!response.ok) {
                    setMensagem("Erro ao buscar áreas.")
                    return
                }

                const dados = await response.json()
                setAreas(dados)

            } catch (error) {
                console.log(error)
                setMensagem("Erro ao buscar áreas.")
            }
        }

        buscarAreas()

    }, [])

    const areasFiltradas = areas.filter(area => area.instituicao === instituicao)

    const exigeBimestre =
        instituicao === "Sesi" &&
        secoesBimestrais.includes(secao)

    const exigeTitulo = secoesBimestrais.includes(secao)

    const permiteEvidencias =
        secao === "Participação em Sala de Aula" ||
        secao === "Projetos e Trabalhos Desenvolvidos"

    const permiteReflexaoPratica =
        secao === "Participação em Sala de Aula" ||
        secao === "Reflexão Crítica"

    let rotuloDescricao = "Descrição"
    let placeholderDescricao = "Digite a descrição"

    if (secao === "Fundamentos Teóricos") {
        rotuloDescricao = "Resumo teórico"
        placeholderDescricao = "Descreva as principais teorias, conceitos e metodologias estudadas"
    }

    if (secao === "Participação em Sala de Aula") {
        rotuloDescricao = "Registro de atividades"
        placeholderDescricao = "Descreva as atividades, discussões e temas abordados em sala de aula"
    }

    if (secao === "Projetos e Trabalhos Desenvolvidos") {
        rotuloDescricao = "Descrição das atividades"
        placeholderDescricao = "Descreva os projetos, trabalhos, pesquisas e atividades práticas desenvolvidas"
    }

    if (secao === "Reflexão Crítica") {
        rotuloDescricao = "Aprendizado acadêmico"
        placeholderDescricao = "Reflita sobre os principais conhecimentos adquiridos ao longo do ano"
    }

    if (secao === "Conexões Interdisciplinares") {
        rotuloDescricao = "Relações interdisciplinares"
        placeholderDescricao = "Descreva as relações entre os conhecimentos desta área e outras disciplinas"
    }

    if (secao === "Aprendizados da Escola para a Vida") {
        rotuloDescricao = "Reflexão sobre experiências"
        placeholderDescricao = "Reflita sobre como as experiências escolares contribuem para sua vida e para a sociedade"
    }

    async function cadastrar(event) {
        event.preventDefault()
        setMensagem("")

        const formulario = event.currentTarget
        const token = sessionStorage.getItem("token")

        if (arquivos.length > 10) {
            setMensagem("Selecione no máximo 10 arquivos.")
            return
        }

        const formData = new FormData()

        formData.append("id_area", idArea)
        formData.append("secao", secao)
        formData.append("descricao", descricao)

        if (exigeTitulo) {
            formData.append("titulo", titulo)
        }

        if (exigeBimestre) {
            formData.append("bimestre", bimestre)
        }

        if (secao === "Fundamentos Teóricos" && aprendizado.trim()) {
            formData.append("aprendizado", aprendizado)
        }

        if (permiteReflexaoPratica && reflexaoPratica.trim()) {
            formData.append("reflexao_pratica", reflexaoPratica)
        }

        if (secao === "Participação em Sala de Aula" && autoavaliacao.trim()) {
            formData.append("autoavaliacao", autoavaliacao)
        }

        if (secao === "Reflexão Crítica" && melhoriasNecessarias.trim()) {
            formData.append("melhorias_necessarias", melhoriasNecessarias)
        }

        if (permiteEvidencias) {

            for (const arquivo of arquivos) {

                if (arquivo.size > 20 * 1024 * 1024) {
                    setMensagem("Cada arquivo deve ter no máximo 20 MB.")
                    return
                }

                formData.append("evidencia_visual", arquivo)
            }
        }

        try {
            const response = await fetch(`${API_URL}/registros`, {
                method: "POST",
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
                setMensagem(dados.message || "Erro ao cadastrar registro.")
                return
            }

            setMensagem("Registro cadastrado com sucesso!")

            setInstituicao("")
            setIdArea("")
            setSecao("")
            setBimestre("")
            setTitulo("")
            setDescricao("")
            setAprendizado("")
            setReflexaoPratica("")
            setAutoavaliacao("")
            setMelhoriasNecessarias("")
            setArquivos([])

            formulario.reset()

        } catch (error) {
            console.log(error)
            setMensagem("Erro ao conectar com o servidor.")
        }
    }

    return (
        <div className="cadastro-admin">

            <section className="portfolio-apresentacao">

                <Link to="/admin" className="voltar"> ← Voltar ao painel </Link>

                <h1>Cadastrar registro</h1>

                <p>Adicione um novo conteúdo ao seu portfólio.</p>

            </section>

            <form className="form-admin" onSubmit={cadastrar}>

                <label htmlFor="instituicao">Instituição</label>

                <select
                    id="instituicao"
                    value={instituicao}
                    onChange={event => {
                        setInstituicao(event.target.value)
                        setIdArea("")
                        setBimestre("")
                    }}
                    required
                >
                    <option value="">Selecione a instituição</option>
                    <option value="Sesi">SESI</option>
                    <option value="Senai">SENAI</option>
                </select>

                <label htmlFor="area">Área de conhecimento</label>

                <select
                    id="area"
                    value={idArea}
                    onChange={event => setIdArea(event.target.value)}
                    disabled={!instituicao}
                    required
                >
                    <option value="">Selecione a área</option>

                    {areasFiltradas.map(area => (
                        <option key={area.id_area} value={area.id_area}>
                            {area.nome}
                        </option>
                    ))}
                </select>

                <label htmlFor="secao">Seção</label>

                <select
                    id="secao"
                    value={secao}
                    onChange={event => {
                        setSecao(event.target.value)
                        setBimestre("")
                        setArquivos([])
                    }}
                    required
                >
                    <option value="">Selecione a seção</option>

                    {secoes.map(item => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                {exigeBimestre && (
                    <>
                        <label htmlFor="bimestre">Bimestre</label>

                        <select
                            id="bimestre"
                            value={bimestre}
                            onChange={event => setBimestre(event.target.value)}
                            required
                        >
                            <option value="">Selecione o bimestre</option>

                            {bimestres.map(item => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {exigeTitulo && (
                    <>
                        <label htmlFor="titulo">Título</label>

                        <input
                            id="titulo"
                            type="text"
                            placeholder="Digite o título"
                            value={titulo}
                            onChange={event => setTitulo(event.target.value)}
                            minLength={3}
                            maxLength={200}
                            required
                        />
                    </>
                )}

                {secao && (
                    <>
                        <label htmlFor="descricao">{rotuloDescricao}</label>

                        <textarea
                            id="descricao"
                            placeholder={placeholderDescricao}
                            value={descricao}
                            onChange={event => setDescricao(event.target.value)}
                            rows={5}
                            minLength={5}
                            maxLength={1000}
                            required
                        />
                    </>
                )}

                {secao === "Fundamentos Teóricos" && (
                    <>
                        <label htmlFor="aprendizado">Aprendizado adquirido</label>

                        <textarea
                            id="aprendizado"
                            placeholder="Descreva os conhecimentos e habilidades adquiridos"
                            value={aprendizado}
                            onChange={event => setAprendizado(event.target.value)}
                            rows={5}
                            minLength={10}
                            maxLength={1200}
                        />
                    </>
                )}

                {permiteReflexaoPratica && (
                    <>
                        <label htmlFor="reflexao_pratica">
                            {secao === "Reflexão Crítica" ? "Aplicação prática" : "Reflexão prática"}
                        </label>

                        <textarea
                            id="reflexao_pratica"
                            placeholder="Descreva como os conhecimentos adquiridos podem ser aplicados na prática e no cotidiano"
                            value={reflexaoPratica}
                            onChange={event => setReflexaoPratica(event.target.value)}
                            rows={5}
                            maxLength={1200}
                            required
                        />
                    </>
                )}

                {secao === "Participação em Sala de Aula" && (
                    <>
                        <label htmlFor="autoavaliacao">Autoavaliação</label>

                        <textarea
                            id="autoavaliacao"
                            placeholder="Avalie sua participação, dedicação e envolvimento nas atividades"
                            value={autoavaliacao}
                            onChange={event => setAutoavaliacao(event.target.value)}
                            rows={5}
                            maxLength={1200}
                            required
                        />
                    </>
                )}

                {secao === "Reflexão Crítica" && (
                    <>
                        <label htmlFor="melhorias_necessarias">Melhorias necessárias</label>

                        <textarea
                            id="melhorias_necessarias"
                            placeholder="Identifique os desafios enfrentados e os aspectos que precisam ser melhorados"
                            value={melhoriasNecessarias}
                            onChange={event => setMelhoriasNecessarias(event.target.value)}
                            rows={5}
                            maxLength={1200}
                            required
                        />
                    </>
                )}

                {permiteEvidencias && (
                    <>
                        <label htmlFor="evidencias">Evidências</label>

                        <input
                            key={secao}
                            id="evidencias"
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.webp,.pdf,.docx,.pptx,.xlsx"
                            onChange={event => setArquivos(Array.from(event.target.files))}
                        />

                        <p className="aviso-arquivos">
                            Máximo de 10 arquivos de até 20 MB cada.
                        </p>
                    </>
                )}

                {mensagem && (
                    <p className="mensagem-admin" role="status">{mensagem}</p>
                )}

                <button type="submit">Cadastrar registro</button>

            </form>

        </div>
    )
}

export default CadastroRegistro