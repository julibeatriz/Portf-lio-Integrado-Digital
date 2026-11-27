import { Link} from "react-router-dom"

function Painel() {

    return (
        <div className="painel">

            <section className="portfolio-apresentacao">

                <h1>Seja Bem-vinda Júlia</h1>

                <p>Gerencie os conteúdos do seu portfólio.</p>

            </section>

            <section className="painel-opcoes">

                <div className="cards-areas">

                    <div className="card-area">
                        <h3>Cadastrar áreas</h3>

                        <p>
                            Adicione novas áreas de conhecimento
                            ao SESI e SENAI.
                        </p>

                        <Link to="/admin/areas" className="botao-home">
                            Cadastrar área
                        </Link>
                    </div>

                    <div className="card-area">

                        <h3>Gerenciar áreas</h3>

                        <p>Visualize, edite e exclua as áreas cadastradas.</p>

                        <Link to="/admin/areas/gerenciar" className="botao-home">
                            Gerenciar
                        </Link>

                    </div>

                    <div className="card-area">
                        <h3>Cadastrar registros</h3>

                        <p>
                            Adicione atividades, projetos,
                            aprendizados e evidências.
                        </p>

                        <Link to="/admin/registros/cadastrar"
                            className="botao-home">
                            Novo registro
                        </Link>
                    </div>

                    <div className="card-area">
                        <h3>Gerenciar registros</h3>

                        <p>
                            Visualize, edite e exclua
                            os registros cadastrados.
                        </p>

                        <Link to="/admin/registros"
                            className="botao-home">
                            Gerenciar
                        </Link>
                    </div>

                    <div className="card-area">
                        <h3>Visualizar portfólio</h3>

                        <p>
                            Acesse a área pública e confira
                            os conteúdos publicados.
                        </p>

                        <Link to="/" className="botao-home">
                            Visualizar
                        </Link>
                    </div>

                </div>

            </section>

        </div>
    )
}

export default Painel;