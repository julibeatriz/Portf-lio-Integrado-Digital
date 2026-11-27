import { describe, test, expect, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Navbar from "../src/components/Navbar.jsx"

beforeEach(() => {

    sessionStorage.clear()

})

describe("Componente Navbar", () => {

    test("Deve exibir o link Início", () => {

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        )

        expect(screen.getByRole("link", { name: "Início" }))
            .toBeInTheDocument()

    })

    test("Deve exibir o link Quem Sou Eu", () => {

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        )

        expect(screen.getByRole("link", { name: "Quem Sou Eu" }))
            .toBeInTheDocument()

    })

    test("Deve exibir o link SESI", () => {

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        )

        expect(screen.getByRole("link", { name: "SESI" }))
            .toBeInTheDocument()

    })

    test("Deve exibir o link SENAI", () => {

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        )

        expect(screen.getByRole("link", { name: "SENAI" }))
            .toBeInTheDocument()

    })

    test("Deve exibir Login quando não estiver autenticado", () => {

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        )

        expect(screen.getByRole("link", { name: "Login" }))
            .toBeInTheDocument()

    })

    test("Deve exibir Logout quando estiver autenticado", () => {

        sessionStorage.setItem("token", "token_teste")

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        )

        expect(screen.getByRole("button", { name: "Logout" }))
            .toBeInTheDocument()

    })

    test("Deve remover o token ao realizar logout", () => {

        sessionStorage.setItem("token", "token_teste")

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        )

        fireEvent.click(
            screen.getByRole("button", { name: "Logout" })
        )

        expect(sessionStorage.getItem("token")).toBeNull()

    })

})