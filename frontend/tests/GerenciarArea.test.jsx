import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, fireEvent, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import GerenciarAreas from "../src/pages/admin/GerenciarArea.jsx"

const areas = [
    {
        id_area: 1,
        instituicao: "Sesi",
        nome: "Matemática",
        descricao: "Área de matemática"
    },
    {
        id_area: 2,
        instituicao: "Senai",
        nome: "Programação Web",
        descricao: "Área de programação"
    }
]

beforeEach(() => {

    sessionStorage.setItem("token", "token_teste")

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => areas
    }))

    vi.spyOn(window, "confirm").mockReturnValue(true)

})

afterEach(() => {

    sessionStorage.clear()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()

})

describe("Página GerenciarAreas", () => {

    test("Deve renderizar a página", async () => {

        render(
            <MemoryRouter>
                <GerenciarAreas />
            </MemoryRouter>
        )

        expect(screen.getByRole("heading", {
            name: "Gerenciar áreas"
        })).toBeInTheDocument()

        await screen.findByText("Matemática")

    })

    test("Deve listar as áreas cadastradas", async () => {

        render(
            <MemoryRouter>
                <GerenciarAreas />
            </MemoryRouter>
        )

        expect(await screen.findByText("Matemática"))
            .toBeInTheDocument()

        expect(screen.getByText("Programação Web"))
            .toBeInTheDocument()

    })

    test("Deve permitir pesquisar uma área", async () => {

        render(
            <MemoryRouter>
                <GerenciarAreas />
            </MemoryRouter>
        )

        await screen.findByText("Matemática")

        fireEvent.change(
            screen.getByPlaceholderText("Pesquisar área..."), {
                target: { value: "Matemática" }
            }
        )

        expect(screen.getByText("Matemática"))
            .toBeInTheDocument()

        expect(screen.queryByText("Programação Web"))
            .not.toBeInTheDocument()

    })

    test("Deve exibir o link para cadastrar nova área", async () => {

        render(
            <MemoryRouter>
                <GerenciarAreas />
            </MemoryRouter>
        )

        expect(screen.getByRole("link", {
            name: "Nova área"
        })).toHaveAttribute("href", "/admin/areas")

        await screen.findByText("Matemática")

    })

    test("Deve exibir os links de edição", async () => {

        render(
            <MemoryRouter>
                <GerenciarAreas />
            </MemoryRouter>
        )

        await screen.findByText("Matemática")

        const links = screen.getAllByRole("link", {
            name: "Editar"
        })

        expect(links[0])
            .toHaveAttribute("href", "/admin/areas/editar/1")

        expect(links[1])
            .toHaveAttribute("href", "/admin/areas/editar/2")

    })

    test("Deve excluir uma área com sucesso", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => areas
        }).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({
                message: "Área excluída com sucesso!"
            })
        }).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => [areas[1]]
        })

        render(
            <MemoryRouter>
                <GerenciarAreas />
            </MemoryRouter>
        )

        const titulo = await screen.findByText("Matemática")
        const card = titulo.closest(".card-registro")

        fireEvent.click(
            within(card).getByRole("button", { name: "Excluir" })
        )

        expect(await screen.findByText("Área excluída com sucesso!"))
            .toBeInTheDocument()

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/areas/1"),
            expect.objectContaining({
                method: "DELETE",
                headers: {
                    Authorization: "Bearer token_teste"
                }
            })
        )

        expect(screen.queryByText("Matemática"))
            .not.toBeInTheDocument()

    })

    test("Deve cancelar a exclusão de uma área", async () => {

        window.confirm.mockReturnValue(false)

        render(
            <MemoryRouter>
                <GerenciarAreas />
            </MemoryRouter>
        )

        const titulo = await screen.findByText("Matemática")
        const card = titulo.closest(".card-registro")

        fireEvent.click(
            within(card).getByRole("button", { name: "Excluir" })
        )

        expect(screen.getByText("Matemática"))
            .toBeInTheDocument()

        expect(fetch).toHaveBeenCalledTimes(1)

    })

    test("Deve impedir a exclusão de área com registros vinculados", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => areas
        }).mockResolvedValueOnce({
            ok: false,
            status: 409,
            json: async () => ({
                message: "A área possui registros vinculados"
            })
        })

        render(
            <MemoryRouter>
                <GerenciarAreas />
            </MemoryRouter>
        )

        const titulo = await screen.findByText("Matemática")
        const card = titulo.closest(".card-registro")

        fireEvent.click(
            within(card).getByRole("button", { name: "Excluir" })
        )

        expect(await screen.findByText("A área possui registros vinculados"))
            .toBeInTheDocument()

        expect(screen.getByText("Matemática"))
            .toBeInTheDocument()

    })

})