import { describe, test, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Home from "../src/pages/home.jsx"

describe("Página Home", () => {

    test("Deve renderizar a página inicial", () => {

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        expect(screen.getByRole("heading", { level: 1 }))
            .toBeInTheDocument()

    })

    test("Deve exibir SESI", () => {

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        expect(screen.getByText("SESI", { exact: true }))
            .toBeInTheDocument()

    })

    test("Deve exibir SENAI", () => {

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        expect(screen.getByText("SENAI", { exact: true }))
            .toBeInTheDocument()

    })

    test("Deve apresentar o link para a página SESI", () => {

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        const links = screen.getAllByRole("link")

        expect(links.some(link =>
            link.getAttribute("href") === "/sesi"
        )).toBeTruthy()

    })

    test("Deve apresentar o link para a página SENAI", () => {

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        const links = screen.getAllByRole("link")

        expect(links.some(link =>
            link.getAttribute("href") === "/senai"
        )).toBeTruthy()

    })

})