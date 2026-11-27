import { Link } from "react-router-dom";

function Erro404 (){
    return(
        <div className="pagina-erro">

            <h1>Erro 404</h1>

            <h2>Página não encontrada</h2>

            <p> A página que você procura não existe ou foi removida. </p>

            <Link to="/" className="botao-home">
                Voltar ao início
            </Link>

        </div>
    )
}

export default Erro404;