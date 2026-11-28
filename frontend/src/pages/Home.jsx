import { Link } from "react-router-dom"
import foto from "../assets/perfil.jpeg"

function Home() {
    return (
        <div className="home">

            <section className="apresentacao-home">

                <img src={foto} alt="Minha foto de perfil" />

                <div className="texto-home">
                    <h1>Bem-vindo ao meu portfólio!</h1>

                    <p>
                        Sou estudante do SESI e do curso de
                        Desenvolvedor Web do SENAI. Neste portfólio,
                        apresento minha trajetória acadêmica, meus
                        projetos e os conhecimentos adquiridos
                        ao longo da minha formação.
                    </p>

                    <Link to="/sobre" className="botao-home">
                        Conheça mais sobre mim
                    </Link>
                </div>

            </section>

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