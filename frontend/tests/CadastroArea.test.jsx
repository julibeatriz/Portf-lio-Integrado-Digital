import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import CadastroArea from "../src/pages/CadastroArea.jsx"

beforeEach(() => {

    sessionStorage.setItem("token", "token_teste")

})

afterEach(() => {

    sessionStorage.clear()
    vi.unstubAllGlobals()

})

describe("Página CadastroArea", () => {

    test("Deve renderizar o formulário", () => {

        render(
            <MemoryRouter>
                <CadastroArea />
            </MemoryRouter>
        )

        expect(screen.getByRole("button", { name: /cadastrar/i }))
            .toBeInTheDocument()

    })

    test("Deve exibir o campo de instituição", () => {

        render(
            <MemoryRouter>
                <CadastroArea />
            </MemoryRouter>
        )

        expect(screen.getByRole("combobox"))
            .toBeInTheDocument()

    })

    test("Deve exibir o campo de nome", () => {

        render(
            <MemoryRouter>
                <CadastroArea />
            </MemoryRouter>
        )

        expect(screen.getByPlaceholderText(/nome/i))
            .toBeInTheDocument()

    })

    test("Deve exibir o campo de descrição", () => {

        render(
            <MemoryRouter>
                <CadastroArea />
            </MemoryRouter>
        )

        expect(screen.getByPlaceholderText(/descrição/i))
            .toBeInTheDocument()

    })

    test("Deve permitir selecionar a instituição", () => {

        render(
            <MemoryRouter>
                <CadastroArea />
            </MemoryRouter>
        )

        const instituicao = screen.getByRole("combobox")

        fireEvent.change(instituicao, {
            target: { value: "Sesi" }
        })

        expect(instituicao).toHaveValue("Sesi")

    })

    test("Deve permitir preencher o nome", () => {

        render(
            <MemoryRouter>
                <CadastroArea />
            </MemoryRouter>
        )

        const nome = screen.getByPlaceholderText(/nome/i)

        fireEvent.change(nome, {
            target: { value: "Matemática" }
        })

        expect(nome).toHaveValue("Matemática")

    })

    test("Deve permitir preencher a descrição", () => {

        render(
            <MemoryRouter>
                <CadastroArea />
            </MemoryRouter>
        )

        const descricao = screen.getByPlaceholderText(/descrição/i)

        fireEvent.change(descricao, {
            target: { value: "Área de conhecimento" }
        })

        expect(descricao).toHaveValue("Área de conhecimento")

    })

    test("Deve cadastrar uma área com sucesso", async () => {

        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: true,
            status: 201,
            json: async () => ({
                id_area: 1,
                instituicao: "Sesi",
                nome: "Matemática",
                descricao: "Área de conhecimento"
            })
        }))

        render(
            <MemoryRouter>
                <CadastroArea />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByRole("combobox"), {
            target: { value: "Sesi" }
        })

        fireEvent.change(screen.getByPlaceholderText(/nome/i), {
            target: { value: "Matemática" }
        })

        fireEvent.change(screen.getByPlaceholderText(/descrição/i), {
            target: { value: "Área de conhecimento" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByText(/sucesso/i))
            .toBeInTheDocument()

    })

    test("Deve exibir mensagem de erro no cadastro", async () => {

        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: false,
            status: 400,
            json: async () => ({
                message: "Erro ao cadastrar área"
            })
        }))

        render(
            <MemoryRouter>
                <CadastroArea />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByRole("combobox"), {
            target: { value: "Sesi" }
        })

        fireEvent.change(screen.getByPlaceholderText(/nome/i), {
            target: { value: "Matemática" }
        })

        fireEvent.change(screen.getByPlaceholderText(/descrição/i), {
            target: { value: "Área de conhecimento" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByText(/erro/i))
            .toBeInTheDocument()

    })

})