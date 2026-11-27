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

    test("Deve filtrar as áreas do SESI", async () => {

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

    test("Deve filtrar as áreas do SENAI", async () => {

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

        expect(screen.queryByRole("option", {
            name: "Matemática"
        })).not.toBeInTheDocument()

    })

    test("Deve exibir as seções do portfólio", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        const secoes = [
            "Fundamentos Teóricos",
            "Participação em Sala de Aula",
            "Projetos e Trabalhos Desenvolvidos",
            "Reflexão Crítica",
            "Conexões Interdisciplinares",
            "Aprendizados da Escola para a Vida"
        ]

        for (const secao of secoes) {

            expect(await screen.findByRole("option", {
                name: secao
            })).toBeInTheDocument()

        }

    })

    test("Deve exibir os bimestres nas seções bimestrais do SESI", async () => {

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

        const secoes = [
            "Fundamentos Teóricos",
            "Participação em Sala de Aula",
            "Projetos e Trabalhos Desenvolvidos"
        ]

        for (const secao of secoes) {

            fireEvent.change(screen.getByLabelText(/seção/i), {
                target: { value: secao }
            })

            expect(screen.getByRole("option", {
                name: "1º Bimestre"
            })).toBeInTheDocument()

            expect(screen.getByRole("option", {
                name: "4º Bimestre"
            })).toBeInTheDocument()

        }

    })

    test("Deve ocultar os bimestres nas seções anuais do SESI", async () => {

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

        const secoes = [
            "Reflexão Crítica",
            "Conexões Interdisciplinares",
            "Aprendizados da Escola para a Vida"
        ]

        for (const secao of secoes) {

            fireEvent.change(screen.getByLabelText(/seção/i), {
                target: { value: secao }
            })

            expect(screen.queryByLabelText(/bimestre/i))
                .not.toBeInTheDocument()

        }

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

        await screen.findByRole("option", {
            name: "Programação Web"
        })

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Fundamentos Teóricos" }
        })

        expect(screen.queryByLabelText(/bimestre/i))
            .not.toBeInTheDocument()

    })

    test("Deve limpar o bimestre ao selecionar uma seção anual", async () => {

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

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Fundamentos Teóricos" }
        })

        fireEvent.change(screen.getByLabelText(/bimestre/i), {
            target: { value: "1º Bimestre" }
        })

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Reflexão Crítica" }
        })

        expect(screen.queryByLabelText(/bimestre/i))
            .not.toBeInTheDocument()

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Fundamentos Teóricos" }
        })

        expect(screen.getByLabelText(/bimestre/i))
            .toHaveValue("")

    })

    test("Deve exibir o título nas três primeiras seções", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        const secoes = [
            "Fundamentos Teóricos",
            "Participação em Sala de Aula",
            "Projetos e Trabalhos Desenvolvidos"
        ]

        for (const secao of secoes) {

            fireEvent.change(screen.getByLabelText(/seção/i), {
                target: { value: secao }
            })

            expect(await screen.findByLabelText(/título/i))
                .toBeInTheDocument()

            expect(screen.getByLabelText(/título/i))
                .toBeRequired()

        }

    })

    test("Deve ocultar o título nas seções anuais", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        const secoes = [
            "Reflexão Crítica",
            "Conexões Interdisciplinares",
            "Aprendizados da Escola para a Vida"
        ]

        for (const secao of secoes) {

            fireEvent.change(screen.getByLabelText(/seção/i), {
                target: { value: secao }
            })

            expect(screen.queryByLabelText(/título/i))
                .not.toBeInTheDocument()

        }

    })

    test("Deve permitir preencher o título", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Fundamentos Teóricos" }
        })

        const titulo = await screen.findByLabelText(/título/i)

        fireEvent.change(titulo, {
            target: { value: "Sistema ABO" }
        })

        expect(titulo).toHaveValue("Sistema ABO")

    })

    test("Deve permitir preencher o resumo teórico", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Fundamentos Teóricos" }
        })

        const descricao = await screen.findByLabelText(/resumo teórico/i)

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

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Fundamentos Teóricos" }
        })

        const aprendizado = await screen.findByLabelText(/aprendizado adquirido/i)

        fireEvent.change(aprendizado, {
            target: { value: "Conhecimento adquirido na atividade" }
        })

        expect(aprendizado)
            .toHaveValue("Conhecimento adquirido na atividade")

    })

    test("Deve exibir os campos de Fundamentos Teóricos", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Fundamentos Teóricos" }
        })

        expect(await screen.findByLabelText(/resumo teórico/i))
            .toBeInTheDocument()

        expect(screen.getByLabelText(/aprendizado adquirido/i))
            .toBeInTheDocument()

        expect(screen.queryByLabelText(/autoavaliação/i))
            .not.toBeInTheDocument()

        expect(screen.queryByLabelText(/melhorias necessárias/i))
            .not.toBeInTheDocument()

    })

    test("Deve exibir os campos de Participação em Sala de Aula", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Participação em Sala de Aula" }
        })

        expect(await screen.findByLabelText(/registro de atividades/i))
            .toBeInTheDocument()

        expect(screen.getByLabelText(/reflexão prática/i))
            .toBeRequired()

        expect(screen.getByLabelText(/autoavaliação/i))
            .toBeRequired()

        expect(screen.queryByLabelText(/aprendizado adquirido/i))
            .not.toBeInTheDocument()

    })

    test("Deve exibir os campos de Projetos e Trabalhos Desenvolvidos", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Projetos e Trabalhos Desenvolvidos" }
        })

        expect(await screen.findByLabelText(/descrição das atividades/i))
            .toBeInTheDocument()

        expect(screen.getByLabelText(/título/i))
            .toBeInTheDocument()

        expect(screen.queryByLabelText(/autoavaliação/i))
            .not.toBeInTheDocument()

    })

    test("Deve exibir os campos de Reflexão Crítica", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Reflexão Crítica" }
        })

        expect(await screen.findByLabelText(/aprendizado acadêmico/i))
            .toBeRequired()

        expect(screen.getByLabelText(/aplicação prática/i))
            .toBeRequired()

        expect(screen.getByLabelText(/melhorias necessárias/i))
            .toBeRequired()

        expect(screen.queryByLabelText(/título/i))
            .not.toBeInTheDocument()

    })

    test("Deve exibir os campos de Conexões Interdisciplinares", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Conexões Interdisciplinares" }
        })

        expect(await screen.findByLabelText(/relações interdisciplinares/i))
            .toBeRequired()

        expect(screen.queryByLabelText(/título/i))
            .not.toBeInTheDocument()

        expect(screen.queryByLabelText(/bimestre/i))
            .not.toBeInTheDocument()

    })

    test("Deve exibir os campos de Aprendizados da Escola para a Vida", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Aprendizados da Escola para a Vida" }
        })

        expect(await screen.findByLabelText(/reflexão sobre experiências/i))
            .toBeRequired()

        expect(screen.queryByLabelText(/título/i))
            .not.toBeInTheDocument()

        expect(screen.queryByLabelText(/bimestre/i))
            .not.toBeInTheDocument()

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

        fireEvent.change(screen.getByLabelText(/resumo teórico/i), {
            target: { value: "Descrição do registro de teste" }
        })

        fireEvent.change(screen.getByLabelText(/aprendizado adquirido/i), {
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

        expect(dados.get("id_area")).toBe("1")
        expect(dados.get("secao")).toBe("Fundamentos Teóricos")
        expect(dados.get("bimestre")).toBe("1º Bimestre")
        expect(dados.get("titulo")).toBe("Registro de teste")
        expect(dados.get("descricao")).toBe("Descrição do registro de teste")
        expect(dados.get("aprendizado")).toBe("Aprendizado adquirido durante a atividade")

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

        fireEvent.change(screen.getByLabelText(/resumo teórico/i), {
            target: { value: "Descrição da atividade do SENAI" }
        })

        fireEvent.change(screen.getByLabelText(/aprendizado adquirido/i), {
            target: { value: "Aprendizado adquirido durante a atividade" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByText(/sucesso/i))
            .toBeInTheDocument()

        const dados = fetch.mock.calls[1][1].body

        expect(dados.get("id_area")).toBe("2")
        expect(dados.get("titulo")).toBe("Registro SENAI")
        expect(dados.has("bimestre")).toBe(false)

    })

    test("Deve cadastrar Reflexão Crítica sem título e sem bimestre", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => areas
        }).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => ({
                id_registro: "registro_anual",
                titulo: "Reflexão Crítica",
                bimestre: null
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
            target: { value: "Reflexão Crítica" }
        })

        fireEvent.change(screen.getByLabelText(/aprendizado acadêmico/i), {
            target: { value: "Conhecimentos adquiridos durante o ano" }
        })

        fireEvent.change(screen.getByLabelText(/aplicação prática/i), {
            target: { value: "Aplicação dos conhecimentos no cotidiano" }
        })

        fireEvent.change(screen.getByLabelText(/melhorias necessárias/i), {
            target: { value: "Melhorar a organização dos estudos" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByText(/sucesso/i))
            .toBeInTheDocument()

        const dados = fetch.mock.calls[1][1].body

        expect(dados.get("secao")).toBe("Reflexão Crítica")
        expect(dados.has("titulo")).toBe(false)
        expect(dados.has("bimestre")).toBe(false)
        expect(dados.has("aprendizado")).toBe(false)
        expect(dados.has("autoavaliacao")).toBe(false)
        expect(dados.get("descricao")).toBe("Conhecimentos adquiridos durante o ano")
        expect(dados.get("reflexao_pratica")).toBe("Aplicação dos conhecimentos no cotidiano")
        expect(dados.get("melhorias_necessarias")).toBe("Melhorar a organização dos estudos")

    })

    test("Deve cadastrar Participação em Sala de Aula com autoavaliação", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => areas
        }).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => ({
                id_registro: "registro_participacao",
                titulo: "Atividade em sala"
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
            target: { value: "Participação em Sala de Aula" }
        })

        fireEvent.change(screen.getByLabelText(/bimestre/i), {
            target: { value: "1º Bimestre" }
        })

        fireEvent.change(screen.getByLabelText(/título/i), {
            target: { value: "Atividade em sala" }
        })

        fireEvent.change(screen.getByLabelText(/registro de atividades/i), {
            target: { value: "Atividade realizada durante a aula" }
        })

        fireEvent.change(screen.getByLabelText(/reflexão prática/i), {
            target: { value: "Aplicação dos conceitos estudados" }
        })

        fireEvent.change(screen.getByLabelText(/autoavaliação/i), {
            target: { value: "Participei das atividades propostas" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByText(/sucesso/i))
            .toBeInTheDocument()

        const dados = fetch.mock.calls[1][1].body

        expect(dados.get("titulo")).toBe("Atividade em sala")
        expect(dados.get("bimestre")).toBe("1º Bimestre")
        expect(dados.get("descricao")).toBe("Atividade realizada durante a aula")
        expect(dados.get("reflexao_pratica")).toBe("Aplicação dos conceitos estudados")
        expect(dados.get("autoavaliacao")).toBe("Participei das atividades propostas")
        expect(dados.has("melhorias_necessarias")).toBe(false)
        expect(dados.has("aprendizado")).toBe(false)

    })

    test("Deve cadastrar Conexões Interdisciplinares sem título", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => areas
        }).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => ({
                id_registro: "registro_conexoes",
                titulo: "Conexões Interdisciplinares"
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
            target: { value: "Conexões Interdisciplinares" }
        })

        fireEvent.change(screen.getByLabelText(/relações interdisciplinares/i), {
            target: { value: "Relação entre matemática e programação" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByText(/sucesso/i))
            .toBeInTheDocument()

        const dados = fetch.mock.calls[1][1].body

        expect(dados.get("secao")).toBe("Conexões Interdisciplinares")
        expect(dados.get("descricao")).toBe("Relação entre matemática e programação")
        expect(dados.has("titulo")).toBe(false)
        expect(dados.has("bimestre")).toBe(false)

    })

    test("Deve cadastrar Aprendizados da Escola para a Vida sem título", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => areas
        }).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => ({
                id_registro: "registro_vida",
                titulo: "Aprendizados da Escola para a Vida"
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
            target: { value: "Aprendizados da Escola para a Vida" }
        })

        fireEvent.change(screen.getByLabelText(/reflexão sobre experiências/i), {
            target: { value: "Importância dos conhecimentos para a vida em sociedade" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByText(/sucesso/i))
            .toBeInTheDocument()

        const dados = fetch.mock.calls[1][1].body

        expect(dados.get("secao")).toBe("Aprendizados da Escola para a Vida")
        expect(dados.get("descricao")).toBe("Importância dos conhecimentos para a vida em sociedade")
        expect(dados.has("titulo")).toBe(false)
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

        fireEvent.change(screen.getByLabelText(/resumo teórico/i), {
            target: { value: "Descrição do registro de teste" }
        })

        fireEvent.change(screen.getByLabelText(/aprendizado adquirido/i), {
            target: { value: "Aprendizado adquirido durante a atividade" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByText(/erro ao cadastrar registro/i))
            .toBeInTheDocument()

    })

    test("Deve exibir evidências em Participação em Sala de Aula", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Participação em Sala de Aula" }
        })

        expect(await screen.findByLabelText(/evidências/i))
            .toBeInTheDocument()

    })

    test("Deve exibir evidências em Projetos e Trabalhos Desenvolvidos", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Projetos e Trabalhos Desenvolvidos" }
        })

        expect(await screen.findByLabelText(/evidências/i))
            .toBeInTheDocument()

    })

    test("Deve ocultar evidências nas demais seções", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        const secoes = [
            "Fundamentos Teóricos",
            "Reflexão Crítica",
            "Conexões Interdisciplinares",
            "Aprendizados da Escola para a Vida"
        ]

        for (const secao of secoes) {

            fireEvent.change(screen.getByLabelText(/seção/i), {
                target: { value: secao }
            })

            expect(screen.queryByLabelText(/evidências/i))
                .not.toBeInTheDocument()

        }

    })

})