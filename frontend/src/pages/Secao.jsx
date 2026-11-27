import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { API_URL } from "../services/api.js"

function Secao() {

    const { id, secao } = useParams()

    const [registros, setRegistros] = useState([])
    const [bimestre, setBimestre] = useState("Todos")
    const [erro, setErro] = useState("")
    const [carregando, setCarregando] = useState(true)
    const [instituicao, setInstituicao] = useState("")

    const secoesBimestrais = [
        "Fundamentos Teóricos",
        "Participação em Sala de Aula",
        "Projetos e Trabalhos Desenvolvidos"
    ]

    const bimestres = [
        "Todos",
        "1º Bimestre",
        "2º Bimestre",
        "3º Bimestre",
        "4º Bimestre"
    ]

    useEffect(() => {

        async function buscarRegistros() {
            try {
                setCarregando(true)
                setErro("")
                setBimestre("Todos")
                setRegistros([])
                setInstituicao("")

                const respostaArea = await fetch(`${API_URL}/areas/${id}`)

                if (!respostaArea.ok) {
                    throw new Error("Erro ao buscar área")
                }

                const dadosArea = await respostaArea.json()

                setInstituicao(dadosArea.instituicao)

                const response = await fetch(`${API_URL}/registros`)

                if (!response.ok) {
                    throw new Error("Erro ao buscar registros")
                }

                const dados = await response.json()

                const registrosSecao = dados.filter(
                    registro =>
                        String(registro.id_area) === id &&
                        registro.secao === secao
                )

                setRegistros(registrosSecao)

            } catch (error) {
                console.log(error)
                setErro("Não foi possível carregar os registros.")
            } finally {
                setCarregando(false)
            }
        }

        buscarRegistros()

    }, [id, secao])

    const exigeBimestre = instituicao === "Sesi" && secoesBimestrais.includes(secao)

    const registrosFiltrados = registros.filter( registro => !exigeBimestre || bimestre === "Todos" || registro.bimestre === bimestre)

    return (
        <div className="secao">

            <section className="portfolio-apresentacao">

                <Link to={`/area/${id}`} className="voltar">
                    ← Voltar às seções
                </Link>

                <span>PORTFÓLIO ACADÊMICO</span>

                <h1>{secao}</h1>

                <p>
                    Conhecimentos e experiências adquiridos
                    durante minha formação.
                </p>

            </section>

            <section className="registros-academicos">

                {exigeBimestre && (
                    <>
                        <h2>Selecione o bimestre</h2>

                        <div className="filtro-bimestres">

                            {bimestres.map(item => (
                                <button
                                    key={item}
                                    onClick={() => setBimestre(item)}
                                    className={bimestre === item ? "ativo" : ""}
                                >
                                    {item}
                                </button>
                            ))}

                        </div>
                    </>
                )}

                <h2>Registros acadêmicos</h2>

                {erro && <p>{erro}</p>}

                {carregando && <p>Carregando registros...</p>}

                {!carregando && !erro && registrosFiltrados.length === 0 && (<p className="sem-registros"> Nenhum registro encontrado. </p>)}

                <div className="lista-registros">

                    {registrosFiltrados.map(registro => (
                        <div
                            className="card-registro"
                            key={registro.id_registro}
                        >

                           {exigeBimestre && registro.bimestre && ( <span>{registro.bimestre}</span>)}

                            <h3>{registro.titulo}</h3>

                            <p>{registro.descricao}</p>

                            <Link
                                to={`/registro/${registro.id_registro}`}
                                className="botao-home"
                            >
                                Ver detalhes
                            </Link>

                        </div>
                    ))}

                </div>

            </section>

        </div>
    )
}

export default Secao