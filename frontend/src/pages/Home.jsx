import { Link } from "react-router-dom"

function Home() {
    return (
        <div>
            <h1>Portfólio Integrado Digital</h1>

            <section className="formacao">
            <h2>Minha formação</h2>

            <p>Conheça minha trajetória escolar e profissional.</p>

            <div className="cards-formacao">

            <div className="card-formacao">
                <h3>SESI</h3>

                <p>
                    Atividades, conhecimentos e aprendizados
                    da formação escolar.
                </p>

                <Link to="/sesi" className="botao-home">
                    Acessar portfólio
                </Link>
            </div>

            <div className="card-formacao">
                <h3>SENAI</h3>

                <p>
                    Projetos, experiências e conhecimentos
                    da formação profissional.
                </p>

                <Link to="/senai" className="botao-home">
                    Acessar portfólio
                </Link>
            </div>

        </div>
            </section>
        </div>

        
    )
}

export default Home;