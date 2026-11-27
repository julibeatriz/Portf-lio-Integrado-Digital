import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { API_URL } from "../services/api.js"

function Registro() {

    const { id } = useParams()

    const [registro, setRegistro] = useState(null)
    const [erro, setErro] = useState("")

    async function buscarRegistro() {
        try {
            setRegistro(null)
            setErro("")

            const response = await fetch(`${API_URL}/registros/${id}`)

            if (!response.ok) {
                setErro("Registro não encontrado ou indisponível.")
                return
            }

            const dados = await response.json()
            setRegistro(dados)

        } catch (error) {
            console.log(error)
            setErro("Erro ao buscar registro.")
        }
    }

    useEffect(() => {
        buscarRegistro()
    }, [id])

    if (erro) {
        return <p>{erro}</p>
    }

    if (!registro) {
        return <p>Carregando registro...</p>
    }

    const secoesAnuais = [
        "Quem Sou Eu",
        "Reflexão Crítica",
        "Conexões Interdisciplinares",
        "Aprendizados da Escola para a Vida"
    ]

    const secaoAnual = secoesAnuais.includes(registro.secao)

    const permiteEvidencias =
        registro.secao === "Participação em Sala de Aula" ||
        registro.secao === "Projetos e Trabalhos Desenvolvidos"

    const permiteReflexaoPratica =
        registro.secao === "Participação em Sala de Aula" ||
        registro.secao === "Reflexão Crítica"

    let rotuloDescricao = "Descrição"

    if (registro.secao === "Fundamentos Teóricos") {
        rotuloDescricao = "Resumo teórico"
    }

    if (registro.secao === "Participação em Sala de Aula") {
        rotuloDescricao = "Registro de atividades"
    }

    if (registro.secao === "Projetos e Trabalhos Desenvolvidos") {
        rotuloDescricao = "Descrição das atividades"
    }

    if (registro.secao === "Reflexão Crítica") {
        rotuloDescricao = "Aprendizado acadêmico"
    }

    if (registro.secao === "Conexões Interdisciplinares") {
        rotuloDescricao = "Relações interdisciplinares"
    }

    if (registro.secao === "Aprendizados da Escola para a Vida") {
        rotuloDescricao = "Reflexão sobre experiências"
    }

    return (
        <div className="registro">

            <section className="portfolio-apresentacao">

                <Link to={`/area/${registro.id_area}/secao/${encodeURIComponent(registro.secao)}`} className="voltar">  ← Voltar aos registros</Link>

                {!secaoAnual && (
                    <span>
                        {registro.secao}
                        {registro.bimestre && ` | ${registro.bimestre}`}
                    </span>
                )}

                <h1>{secaoAnual ? registro.secao : registro.titulo}</h1>

            </section>

            <section className="registro-conteudo">

                <div className="registro-detalhes">

                    <h2>{rotuloDescricao}</h2>
                    <p>{registro.descricao}</p>

                    {registro.secao === "Fundamentos Teóricos" && registro.aprendizado && (
                        <>
                            <hr />

                            <h2>Aprendizado adquirido</h2>
                            <p>{registro.aprendizado}</p>
                        </>
                    )}

                    {permiteReflexaoPratica && registro.reflexao_pratica && (
                        <>
                            <hr />

                            <h2>
                                {registro.secao === "Reflexão Crítica" ? "Aplicação prática" : "Reflexão prática"}
                            </h2>

                            <p>{registro.reflexao_pratica}</p>
                        </>
                    )}

                    {registro.secao === "Participação em Sala de Aula" && registro.autoavaliacao && (
                        <>
                            <hr />

                            <h2>Autoavaliação</h2>
                            <p>{registro.autoavaliacao}</p>
                        </>
                    )}

                    {registro.secao === "Reflexão Crítica" && registro.melhorias_necessarias && (
                        <>
                            <hr />

                            <h2>Melhorias necessárias</h2>
                            <p>{registro.melhorias_necessarias}</p>
                        </>
                    )}

                    {permiteEvidencias && (
                        <>
                            <hr />

                            <h2>Evidências</h2>

                            <div className="evidencias">

                                {(registro.evidencia_visual || []).map(arquivo => {

                                    const url = `http://localhost:3333/public/${encodeURIComponent(arquivo)}`
                                    const nome = arquivo.toLowerCase()

                                    const imagem = nome.endsWith(".jpg") ||
                                                   nome.endsWith(".jpeg") ||
                                                   nome.endsWith(".png") ||
                                                   nome.endsWith(".webp")

                                    return (
                                        <div className="evidencia" key={arquivo}>

                                            <a href={url} target="_blank" rel="noopener noreferrer">

                                                {imagem ? (
                                                    <img src={url} alt="Evidência da atividade" />
                                                ) : (
                                                    <span className="botao-home"> Acessar documento </span>
                                                )}

                                            </a>

                                        </div>
                                    )
                                })}

                            </div>

                            {!registro.evidencia_visual?.length && ( <p>Nenhuma evidência cadastrada.</p> )}
                        </>
                    )}

                </div>

            </section>

        </div>
    )
}

export default Registro;