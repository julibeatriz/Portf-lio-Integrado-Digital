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

    const bimestres = [
        "1º Bimestre",
        "2º Bimestre",
        "3º Bimestre",
        "4º Bimestre"
    ]


    useEffect(() => {

        async function buscarAreas() {
            try {
                const response = await fetch(`${API_URL}/areas`);

                if (!response.ok) {
                    setMensagem("Erro ao buscar áreas.");
                    return
                }

                const dados = await response.json();
                setAreas(dados);

            } catch (error) {
                console.log(error)
                setMensagem("Erro ao buscar áreas.")
            }
        }

        buscarAreas()

    }, [])


    const areasFiltradas = areas.filter(area => area.instituicao === instituicao)

    async function cadastrar(event) {
        event.preventDefault()
        setMensagem("")

        const formulario = event.currentTarget
        const token = sessionStorage.getItem("token");

        if (arquivos.length > 10) {
            setMensagem("Selecione no máximo 10 arquivos.")
            return
        }

        const formData = new FormData()

        formData.append("id_area", idArea);
        formData.append("secao", secao);
        formData.append("bimestre", bimestre);
        formData.append("titulo", titulo);
        formData.append("descricao", descricao);

        if (aprendizado.trim()) {
            formData.append("aprendizado", aprendizado)
        }

        for (const arquivo of arquivos) {

            if (arquivo.size > 20 * 1024 * 1024) {
                setMensagem("Cada arquivo deve ter no máximo 20 MB.")
                return
            }

            formData.append("evidencia_visual", arquivo)
        }

        try {
            const response = await fetch(`${API_URL}/registros` , {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`},
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

                <Link to="/admin" className="voltar">
                    ← Voltar ao painel
                </Link>

                <h1>Cadastrar registro</h1>

                <p> Adicione um novo conteúdo ao seu portfólio.</p>

            </section>

            <form className="form-admin" onSubmit={cadastrar}>

                <label htmlFor="instituicao">Instituição</label>

                <select
                    id="instituicao"
                    value={instituicao}
                    onChange={event => {
                        setInstituicao(event.target.value)
                        setIdArea("")
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
                        <option key={area.id_area} value={area.id_area}> {area.nome} </option>
                    ))}
                </select>

                <label htmlFor="secao">Seção</label>

                <select
                    id="secao"
                    value={secao}
                    onChange={event => setSecao(event.target.value)}
                    required
                >
                    <option value="">Selecione a seção</option>

                    {secoes.map(item => (
                        <option key={item} value={item}> {item} </option>
                    ))}
                </select>

                <label htmlFor="bimestre">Bimestre</label>

                <select
                    id="bimestre"
                    value={bimestre}
                    onChange={event => setBimestre(event.target.value)}
                    required
                >
                    <option value="">Selecione o bimestre</option>

                    {bimestres.map(item => (
                        <option key={item} value={item}> {item} </option>
                    ))}
                </select>

                <label htmlFor="titulo">Título</label>

                <input
                    id="titulo"
                    type="text"
                    placeholder="Digite o título da atividade"
                    value={titulo}
                    onChange={event => setTitulo(event.target.value)}
                    minLength={3}
                    maxLength={200}
                    required
                />

                <label htmlFor="descricao"> Descrição da atividade</label>

                <textarea
                    id="descricao"
                    placeholder="Descreva a atividade realizada"
                    value={descricao}
                    onChange={event => setDescricao(event.target.value)}
                    rows={5}
                    minLength={5}
                    maxLength={1000}
                    required
                />

                <label htmlFor="aprendizado"> Aprendizado adquirido</label>

                <textarea
                    id="aprendizado"
                    placeholder="Descreva o aprendizado adquirido"
                    value={aprendizado}
                    onChange={event => setAprendizado(event.target.value)}
                    rows={5}
                    minLength={10}
                    maxLength={1200}
                />

                <label htmlFor="evidencias">Evidências</label>

                <input
                    id="evidencias"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp,.pdf,.docx,.pptx,.xlsx"
                    onChange={event => setArquivos(
                        Array.from(event.target.files)
                    )}
                />

                <p className="aviso-arquivos"> Máximo de 10 arquivos de até 20 MB cada.</p>

                {mensagem && ( <p className="mensagem-admin" role="status">{mensagem}</p>)}

                <button type="submit"> Cadastrar registro</button>

            </form>

        </div>
    )
}

export default CadastroRegistro