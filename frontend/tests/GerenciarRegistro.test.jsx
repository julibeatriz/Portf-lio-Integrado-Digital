import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, fireEvent, within, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import GerenciarRegistros from "../src/pages/admin/GerenciarRegistro.jsx"

const registros = [
    {
        id_registro: "1",
        titulo: "Sistema ABO",
        bimestre: "1º Bimestre",
        secao: "Fundamentos Teóricos"
    },
    {
        id_registro: "2",
        titulo: "Desenvolvimento Web",
        bimestre: "2º Bimestre",
        secao: "Projetos e Trabalhos Desenvolvidos"
    }
]

beforeEach(() => {

    sessionStorage.setItem("token", "token_teste")

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => registros
    }))

    vi.spyOn(window, "confirm").mockReturnValue(true)

})

afterEach(() => {

    sessionStorage.clear()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()

})

describe("Página GerenciarRegistros", () => {

    test("Deve renderizar a página", async () => {

        render(
            <MemoryRouter>
                <GerenciarRegistros />
            </MemoryRouter>
        )

        expect(screen.getByRole("heading", {
            name: "Gerenciar registros"
        })).toBeInTheDocument()

        await screen.findByText("Sistema ABO")

    })

    test("Deve listar os registros cadastrados", async () => {

        render(
            <MemoryRouter>
                <GerenciarRegistros />
            </MemoryRouter>
        )

        expect(await screen.findByText("Sistema ABO"))
            .toBeInTheDocument()

        expect(screen.getByText("Desenvolvimento Web"))
            .toBeInTheDocument()

    })

    test("Deve permitir pesquisar um registro", async () => {

        render(
            <MemoryRouter>
                <GerenciarRegistros />
            </MemoryRouter>
        )

        await screen.findByText("Sistema ABO")

        fireEvent.change(
            screen.getByLabelText("Pesquisar pelo título"), {
                target: { value: "Sistema ABO" }
            }
        )

        expect(screen.getByText("Sistema ABO"))
            .toBeInTheDocument()

        expect(screen.queryByText("Desenvolvimento Web"))
            .not.toBeInTheDocument()

    })

    test("Deve exibir o link para cadastrar novo registro", async () => {

        render(
            <MemoryRouter>
                <GerenciarRegistros />
            </MemoryRouter>
        )

        expect(screen.getByRole("link", {
            name: /novo registro/i
        })).toHaveAttribute("href", "/admin/registros/cadastrar")

        await screen.findByText("Sistema ABO")

    })

    test("Deve exibir os links de visualização", async () => {

        render(
            <MemoryRouter>
                <GerenciarRegistros />
            </MemoryRouter>
        )

        await screen.findByText("Sistema ABO")

        const links = screen.getAllByRole("link", {
            name: "Visualizar"
        })

        expect(links[0])
            .toHaveAttribute("href", "/registro/1")

        expect(links[1])
            .toHaveAttribute("href", "/registro/2")

    })

    test("Deve exibir os links de edição", async () => {

        render(
            <MemoryRouter>
                <GerenciarRegistros />
            </MemoryRouter>
        )

        await screen.findByText("Sistema ABO")

        const links = screen.getAllByRole("link", {
            name: "Editar"
        })

        expect(links[0])
            .toHaveAttribute("href", "/admin/registros/editar/1")

        expect(links[1])
            .toHaveAttribute("href", "/admin/registros/editar/2")

    })

    test("Deve excluir um registro com sucesso", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => registros
        }).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({
                message: "Registro excluído com sucesso!"
            })
        }).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => [registros[1]]
        })

        render(
            <MemoryRouter>
                <GerenciarRegistros />
            </MemoryRouter>
        )

        const titulo = await screen.findByText("Sistema ABO")
        const card = titulo.closest(".card-registro")

        fireEvent.click(
            within(card).getByRole("button", { name: "Excluir" })
        )

        expect(await screen.findByRole("status"))
            .toHaveTextContent("Registro excluído com sucesso!")

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/registros/1"),
            expect.objectContaining({
                method: "DELETE",
                headers: {
                    Authorization: "Bearer token_teste"
                }
            })
        )

        await waitFor(() => {

            expect(screen.queryByText("Sistema ABO"))
                .not.toBeInTheDocument()

        })

        expect(screen.getByText("Desenvolvimento Web"))
            .toBeInTheDocument()

    })

    test("Deve cancelar a exclusão de um registro", async () => {

        window.confirm.mockReturnValue(false)

        render(
            <MemoryRouter>
                <GerenciarRegistros />
            </MemoryRouter>
        )

        const titulo = await screen.findByText("Sistema ABO")
        const card = titulo.closest(".card-registro")

        fireEvent.click(
            within(card).getByRole("button", { name: "Excluir" })
        )

        expect(screen.getByText("Sistema ABO"))
            .toBeInTheDocument()

        expect(fetch).toHaveBeenCalledTimes(1)

    })

    test("Deve exibir mensagem de erro ao excluir registro", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => registros
        }).mockResolvedValueOnce({
            ok: false,
            status: 500
        })

        render(
            <MemoryRouter>
                <GerenciarRegistros />
            </MemoryRouter>
        )

        const titulo = await screen.findByText("Sistema ABO")
        const card = titulo.closest(".card-registro")

        fireEvent.click(
            within(card).getByRole("button", { name: "Excluir" })
        )

        expect(await screen.findByRole("status"))
            .toHaveTextContent("Erro ao excluir registro.")

        expect(screen.getByText("Sistema ABO"))
            .toBeInTheDocument()

    })

})