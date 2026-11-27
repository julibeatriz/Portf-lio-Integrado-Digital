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

    const permiteEvidencias =
        registro.secao === "Participação em Sala de Aula" ||
        registro.secao === "Projetos e Trabalhos Desenvolvidos"

    return (
        <div className="registro">

            <section className="portfolio-apresentacao">

                <Link to={`/area/${registro.id_area}/secao/${encodeURIComponent(registro.secao)}`} className="voltar">  ← Voltar aos registros</Link>

                <span>
                    {registro.secao}
                    {registro.bimestre && ` | ${registro.bimestre}`}
                </span>

                <h1>{registro.titulo}</h1>

            </section>

            <section className="registro-conteudo">

                <div className="registro-detalhes">

                    <h2>Descrição da atividade</h2>
                    <p>{registro.descricao}</p>

                    <hr />

                    <h2>Aprendizado adquirido</h2>
                    <p> {registro.aprendizado || "Nenhum aprendizado registrado."} </p>

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

export default Registro