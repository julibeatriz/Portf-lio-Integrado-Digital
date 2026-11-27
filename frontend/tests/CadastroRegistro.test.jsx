import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import CadastroRegistro from "../src/pages/admin/CadastroRegistro.jsx"

const areas = [
    {
        id_area: 1,
        instituicao: "Sesi",
        nome: "Matemática"
    },
    {
        id_area: 2,
        instituicao: "Senai",
        nome: "Programação Web"
    }
]

beforeEach(() => {

    sessionStorage.setItem("token", "token_teste")

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => areas
    }))

})

afterEach(() => {

    sessionStorage.clear()
    vi.unstubAllGlobals()

})

describe("Página CadastroRegistro", () => {

    test("Deve renderizar o formulário", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        expect(await screen.findByRole("button", {
            name: /cadastrar/i
        })).toBeInTheDocument()

    })

    test("Deve exibir as instituições", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        expect(await screen.findByRole("option", {
            name: "SESI"
        })).toBeInTheDocument()

        expect(screen.getByRole("option", {
            name: "SENAI"
        })).toBeInTheDocument()

    })

    test("Deve filtrar as áreas pela instituição", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/instituição/i), {
            target: { value: "Sesi" }
        })

        expect(await screen.findByRole("option", {
            name: "Matemática"
        })).toBeInTheDocument()

        expect(screen.queryByRole("option", {
            name: "Programação Web"
        })).not.toBeInTheDocument()

    })

    test("Deve exibir as seções", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        expect(await screen.findByRole("option", {
            name: "Fundamentos Teóricos"
        })).toBeInTheDocument()

    })

    test("Deve exibir os bimestres ao selecionar SESI", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/instituição/i), {
            target: { value: "Sesi" }
        })

        expect(await screen.findByRole("option", {
            name: "1º Bimestre"
        })).toBeInTheDocument()

        expect(screen.getByRole("option", {
            name: "4º Bimestre"
        })).toBeInTheDocument()

    })

    test("Deve ocultar os bimestres ao selecionar SENAI", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/instituição/i), {
            target: { value: "Senai" }
        })

        expect(await screen.findByRole("option", {
            name: "Programação Web"
        })).toBeInTheDocument()

        expect(screen.queryByLabelText(/bimestre/i))
            .not.toBeInTheDocument()

    })

    test("Deve permitir preencher o título", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        const titulo = await screen.findByLabelText(/título/i)

        fireEvent.change(titulo, {
            target: { value: "Sistema ABO" }
        })

        expect(titulo).toHaveValue("Sistema ABO")

    })

    test("Deve permitir preencher a descrição", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        const descricao = await screen.findByLabelText(/descrição/i)

        fireEvent.change(descricao, {
            target: { value: "Descrição da atividade" }
        })

        expect(descricao).toHaveValue("Descrição da atividade")

    })

    test("Deve permitir preencher o aprendizado", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        const aprendizado = await screen.findByLabelText(/aprendizado/i)

        fireEvent.change(aprendizado, {
            target: { value: "Conhecimento adquirido na atividade" }
        })

        expect(aprendizado)
            .toHaveValue("Conhecimento adquirido na atividade")

    })

    test("Deve cadastrar um registro do SESI com sucesso", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => areas
        }).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => ({
                id_registro: "registro_teste",
                titulo: "Registro de teste"
            })
        })

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/instituição/i), {
            target: { value: "Sesi" }
        })

        await screen.findByRole("option", {
            name: "Matemática"
        })

        fireEvent.change(screen.getByLabelText(/área/i), {
            target: { value: "1" }
        })

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Fundamentos Teóricos" }
        })

        fireEvent.change(screen.getByLabelText(/bimestre/i), {
            target: { value: "1º Bimestre" }
        })

        fireEvent.change(screen.getByLabelText(/título/i), {
            target: { value: "Registro de teste" }
        })

        fireEvent.change(screen.getByLabelText(/descrição/i), {
            target: { value: "Descrição do registro de teste" }
        })

        fireEvent.change(screen.getByLabelText(/aprendizado/i), {
            target: { value: "Aprendizado adquirido durante a atividade" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByText(/sucesso/i))
            .toBeInTheDocument()

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/registros"),
            expect.objectContaining({
                method: "POST",
                body: expect.any(FormData)
            })
        )

        const dados = fetch.mock.calls[1][1].body

        expect(dados.get("bimestre")).toBe("1º Bimestre")

    })

    test("Deve cadastrar um registro do SENAI sem bimestre", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => areas
        }).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => ({
                id_registro: "registro_senai",
                titulo: "Registro SENAI",
                bimestre: null
            })
        })

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/instituição/i), {
            target: { value: "Senai" }
        })

        await screen.findByRole("option", {
            name: "Programação Web"
        })

        fireEvent.change(screen.getByLabelText(/área/i), {
            target: { value: "2" }
        })

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Fundamentos Teóricos" }
        })

        fireEvent.change(screen.getByLabelText(/título/i), {
            target: { value: "Registro SENAI" }
        })

        fireEvent.change(screen.getByLabelText(/descrição/i), {
            target: { value: "Descrição da atividade do SENAI" }
        })

        fireEvent.change(screen.getByLabelText(/aprendizado/i), {
            target: { value: "Aprendizado adquirido durante a atividade" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByText(/sucesso/i))
            .toBeInTheDocument()

        const dados = fetch.mock.calls[1][1].body

        expect(dados.has("bimestre")).toBe(false)

    })

    test("Deve exibir mensagem de erro no cadastro", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => areas
        }).mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: async () => ({
                message: "Erro ao cadastrar registro"
            })
        })

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/instituição/i), {
            target: { value: "Sesi" }
        })

        await screen.findByRole("option", {
            name: "Matemática"
        })

        fireEvent.change(screen.getByLabelText(/área/i), {
            target: { value: "1" }
        })

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Fundamentos Teóricos" }
        })

        fireEvent.change(screen.getByLabelText(/bimestre/i), {
            target: { value: "1º Bimestre" }
        })

        fireEvent.change(screen.getByLabelText(/título/i), {
            target: { value: "Registro de teste" }
        })

        fireEvent.change(screen.getByLabelText(/descrição/i), {
            target: { value: "Descrição do registro de teste" }
        })

        fireEvent.change(screen.getByLabelText(/aprendizado/i), {
            target: { value: "Aprendizado adquirido durante a atividade" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByText(/erro/i))
            .toBeInTheDocument()

    })

})