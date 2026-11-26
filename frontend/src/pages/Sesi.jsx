import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { API_URL } from "../services/api.js"

function Sesi() {

    const [areas, setAreas] = useState([])
    const [erro, setErro] = useState("")

    useEffect(() => {

        async function buscarAreas() {
            try {
                const response = await fetch(`${API_URL}/areas`)

                if (!response.ok) {
                    throw new Error("Erro ao buscar áreas")
                }

                const dados = await response.json()

                const areasSesi = dados.filter(
                    area => area.instituicao === "Sesi"
                )

                setAreas(areasSesi)

            } catch (error) {
                console.log(error)
                setErro("Não foi possível carregar as áreas.")
            }
        }

        buscarAreas()

    }, [])

    return (
        <div className="sesi">

            <section className="portfolio-apresentacao">
                <span>FORMAÇÃO ESCOLAR</span>

                <h1>Portfólio SESI</h1>

                <p>
                    Explore meus conhecimentos, atividades
                    e experiências acadêmicas.
                </p>
            </section>

            <section className="areas-conhecimento">
                <h2>Áreas de conhecimento</h2>

                {erro && <p>{erro}</p>}

                <div className="cards-areas">

                    {areas.map(area => (
                        <div className="card-area" key={area.id_area}>

                            <h3>{area.nome}</h3>

                            <p>{area.descricao}</p>

                            <Link
                                to={`/area/${area.id_area}`}
                                className="botao-home"
                            >
                                Explorar área
                            </Link>

                        </div>
                    ))}

                </div>
            </section>

        </div>
    )
}

export default Sesi