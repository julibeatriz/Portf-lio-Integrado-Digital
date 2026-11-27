import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { API_URL } from "../services/api.js"

function Area() {

    const { id } = useParams()

    const [area, setArea] = useState(null)
    const [erro, setErro] = useState("")

    const secoes = [
        "Quem Sou Eu",
        "Fundamentos Teóricos",
        "Participação em Sala de Aula",
        "Projetos e Trabalhos Desenvolvidos",
        "Reflexão Crítica",
        "Conexões Interdisciplinares",
        "Aprendizados da Escola para a Vida"
    ]

    useEffect(() => {

        async function buscarArea() {
            try {
                setArea(null)
                setErro("")

                const response = await fetch(`${API_URL}/areas`)

                if (!response.ok) {
                    throw new Error("Erro ao buscar áreas")
                }

                const dados = await response.json()

                const areaEncontrada = dados.find(
                    item => String(item.id_area) === id
                )

                if (!areaEncontrada) {
                    setErro("Área não encontrada.")
                    return
                }

                setArea(areaEncontrada)

            } catch (error) {
                console.log(error)
                setErro("Não foi possível carregar a área.")
            }
        }

        buscarArea()

    }, [id])

    if (erro) {
        return <p>{erro}</p>
    }

    if (!area) {
        return <p>Carregando área...</p>
    }

    return (
        <div className="area">

            <section className="portfolio-apresentacao">

                <Link
                    to={area.instituicao === "Sesi" ? "/sesi" : "/senai"}
                    className="voltar"
                >
                    ← Voltar ao portfólio
                </Link>

                <span>
                    PORTFÓLIO {area.instituicao.toUpperCase()}
                </span>

                <h1>{area.nome}</h1>

                <p>{area.descricao}</p>

            </section>

            <section className="areas-conhecimento">

                <h2>Seções do portfólio</h2>

                <div className="cards-areas">

                    {secoes.map(secao => (
                        <div className="card-area" key={secao}>

                            <h3>{secao}</h3>

                            <Link
                                to={`/area/${id}/secao/${encodeURIComponent(secao)}`}
                                className="botao-home"
                            >
                                Acessar seção
                            </Link>

                        </div>
                    ))}

                </div>

            </section>

        </div>
    )
}

export default Area