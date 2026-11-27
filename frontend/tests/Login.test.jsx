import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Login from "../src/pages/Login.jsx"

beforeEach(() => {

    sessionStorage.clear()

})

afterEach(() => {

    vi.unstubAllGlobals()

})

describe("Página Login", () => {

    test("Deve exibir o campo de e-mail", () => {

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        expect(screen.getByPlaceholderText(/e-mail/i))
            .toBeInTheDocument()

    })

    test("Deve exibir o campo de senha", () => {

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        expect(screen.getByPlaceholderText(/senha/i))
            .toBeInTheDocument()

    })

    test("Deve exibir o botão de login", () => {

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        expect(screen.getByRole("button", { name: "Entrar" }))
            .toBeInTheDocument()

    })

    test("Deve permitir preencher o e-mail", () => {

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        const email = screen.getByPlaceholderText(/e-mail/i)

        fireEvent.change(email, {
            target: { value: "teste@email.com" }
        })

        expect(email).toHaveValue("teste@email.com")

    })

    test("Deve permitir preencher a senha", () => {

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        const senha = screen.getByPlaceholderText(/senha/i)

        fireEvent.change(senha, {
            target: { value: "senha_teste" }
        })

        expect(senha).toHaveValue("senha_teste")

    })

    test("Deve ocultar a senha inicialmente", () => {

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        const senha = screen.getByPlaceholderText(/senha/i)

        expect(senha).toHaveAttribute("type", "password")

    })

    test("Deve realizar login com sucesso", async () => {

        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({
                message: "Login realizado com sucesso",
                token: "token_teste"
            })
        }))

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByPlaceholderText(/e-mail/i), {
            target: { value: "teste@email.com" }
        })

        fireEvent.change(screen.getByPlaceholderText(/senha/i), {
            target: { value: "senha_teste" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: "Entrar" })
        )

        await waitFor(() => {

            expect(sessionStorage.getItem("token"))
                .toBe("token_teste")

        })

    })

    test("Deve exibir mensagem de erro com login inválido", async () => {

        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: false,
            status: 401,
            json: async () => ({
                message: "E-mail ou senha inválidos"
            })
        }))

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByPlaceholderText(/e-mail/i), {
            target: { value: "teste@email.com" }
        })

        fireEvent.change(screen.getByPlaceholderText(/senha/i), {
            target: { value: "senha_incorreta" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: "Entrar" })
        )

        expect(await screen.findByText("E-mail ou senha inválidos"))
            .toBeInTheDocument()

        expect(sessionStorage.getItem("token")).toBeNull()

    })

})