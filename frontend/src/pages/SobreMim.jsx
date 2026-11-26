import foto from "../assets/WIN_20260430_14_51_13_Pro.jpg"
import { Link } from "react-router-dom"

function SobreMin() {
    return (
        <div className="sobre">

            <section className="sobre-apresentacao">
                <h1>Quem Sou Eu</h1>

        <div className="perfil">
            <img src={foto} alt="Foto de perfil" />

        <div className="perfil-texto">
            <h2>Júlia Beatriz</h2>

            <h3>
                 Estudante | Desenvolvedora Web em formação
            </h3>

            <p>
                Sou estudante do SESI e do curso de
                Desenvolvedor Web no SENAI.
            </p>

            </div>
                </div>
            
            
            </section>

        <section className="trajetoria">
            <h2>Minha Trajetória Acadêmica</h2>

            <div className="cards-trajetoria">

                <div className="card-trajetoria">
                    <h3>SESI</h3>
                    <h4>Formação escolar</h4>

                    <p>
                        Durante minha formação no SESI, desenvolvi
                        conhecimentos em diferentes áreas, ampliando
                        meu pensamento crítico, minha criatividade
                        e minha capacidade de trabalhar em equipe.
                    </p>

                    <Link to="/sesi" className="botao-home">
                        Acessar portfólio
                    </Link>
                </div>

                <div className="card-trajetoria">
                    <h3>SENAI</h3>
                    <h4>Formação profissional</h4>

                    <p>
                        No curso de Desenvolvedor Web, venho adquirindo
                        conhecimentos em programação, desenvolvimento
                        de interfaces, banco de dados e criação de
                        aplicações web.
                    </p>

                    <Link to="/senai" className="botao-home">
                        Acessar portfólio
                    </Link>
                </div>

            </div>

            <div className="habilidades">
                <h3>Habilidades desenvolvidas</h3>

                <p>
                    Ao longo da minha trajetória acadêmica, desenvolvi
                    habilidades como trabalho em equipe, comunicação,
                    criatividade, organização e pensamento crítico.
                    Além disso, aprimorei meu raciocínio lógico,
                    minha autonomia e minha capacidade de resolver
                    problemas, contribuindo para meu crescimento
                    pessoal, acadêmico e profissional.
                </p>
            </div>
        </section>
                </div>
    )
}

export default SobreMin;