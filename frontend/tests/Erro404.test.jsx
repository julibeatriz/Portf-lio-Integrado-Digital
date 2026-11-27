import { describe, test, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Erro404 from "../src/pages/Erro404.jsx"

describe("Página Erro404", () => {

    test("Deve exibir o código 404", () => {

        render(
            <MemoryRouter>
                <Erro404 />
            </MemoryRouter>
        )

        expect(screen.getByText("Erro 404"))
            .toBeInTheDocument()

    })

    test("Deve exibir o título da página", () => {

        render(
            <MemoryRouter>
                <Erro404 />
            </MemoryRouter>
        )

        expect(screen.getByText("Página não encontrada"))
            .toBeInTheDocument()

    })

    test("Deve exibir o link para voltar ao início", () => {

        render(
            <MemoryRouter>
                <Erro404 />
            </MemoryRouter>
        )

        expect(screen.getByRole("link", {
            name: /voltar ao início/i
        })).toBeInTheDocument()

    })

    test("Deve possuir o caminho correto para a página inicial", () => {

        render(
            <MemoryRouter>
                <Erro404 />
            </MemoryRouter>
        )

        expect(screen.getByRole("link", {
            name: /voltar ao início/i
        })).toHaveAttribute("href", "/")

    })

})