import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
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

    cleanup()
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

    test("Deve exibir as seções", async () => {

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

        for(const secao of secoes){

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

        for(const secao of secoes){

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

    test("Deve ocultar título e bimestre nas seções anuais", async () => {

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

        for(const secao of secoes){

            fireEvent.change(screen.getByLabelText(/seção/i), {
                target: { value: secao }
            })

            expect(screen.queryByLabelText(/título/i))
                .not.toBeInTheDocument()

            expect(screen.queryByLabelText(/bimestre/i))
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
        expect(dados.get("bimestre")).toBe("1º Bimestre")
        expect(dados.get("titulo")).toBe("Registro de teste")

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
                id_registro: "registro_anual"
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
        expect(dados.get("reflexao_pratica"))
            .toBe("Aplicação dos conhecimentos no cotidiano")

        expect(dados.get("melhorias_necessarias"))
            .toBe("Melhorar a organização dos estudos")

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

        expect(screen.getByLabelText("Link 1"))
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

        expect(screen.getByLabelText("Link 1"))
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

        for(const secao of secoes){

            fireEvent.change(screen.getByLabelText(/seção/i), {
                target: { value: secao }
            })

            expect(screen.queryByLabelText(/evidências/i))
                .not.toBeInTheDocument()

            expect(screen.queryByLabelText("Link 1"))
                .not.toBeInTheDocument()

        }

    })

})

describe("Links e vídeos das evidências", () => {

    test("Deve permitir preencher um link", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Projetos e Trabalhos Desenvolvidos" }
        })

        const link = await screen.findByLabelText("Link 1")

        fireEvent.change(link, {
            target: { value: "https://github.com/" }
        })

        expect(link).toHaveValue("https://github.com/")

    })

    test("Deve adicionar outro campo de link", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Projetos e Trabalhos Desenvolvidos" }
        })

        fireEvent.click(screen.getByRole("button", {
            name: /adicionar outro link/i
        }))

        expect(await screen.findByLabelText("Link 2"))
            .toBeInTheDocument()

    })

    test("Deve remover um campo de link", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Projetos e Trabalhos Desenvolvidos" }
        })

        fireEvent.click(screen.getByRole("button", {
            name: /adicionar outro link/i
        }))

        const botoes = screen.getAllByRole("button", {
            name: /^remover$/i
        })

        fireEvent.click(botoes[1])

        expect(screen.queryByLabelText("Link 2"))
            .not.toBeInTheDocument()

        expect(screen.getByLabelText("Link 1"))
            .toBeInTheDocument()

    })

    test("Deve limitar o cadastro a 10 links", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Projetos e Trabalhos Desenvolvidos" }
        })

        const botao = screen.getByRole("button", {
            name: /adicionar outro link/i
        })

        for(let i = 0; i < 9; i++){

            fireEvent.click(botao)

        }

        expect(screen.getAllByLabelText(/^Link \d+$/i))
            .toHaveLength(10)

        expect(botao).toBeDisabled()

    })

    test("Deve aceitar imagens, documentos e vídeos", async () => {

        render(
            <MemoryRouter>
                <CadastroRegistro />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/seção/i), {
            target: { value: "Projetos e Trabalhos Desenvolvidos" }
        })

        const campo = await screen.findByLabelText(/evidências/i)

        const formatos = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".pdf",
            ".docx",
            ".pptx",
            ".xlsx",
            ".mp4",
            ".webm"
        ]

        for(const formato of formatos){

            expect(campo.getAttribute("accept"))
                .toContain(formato)

        }

    })

    test("Deve cadastrar registro somente com links", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => areas
        }).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => ({
                id_registro: "registro_links"
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
            target: { value: "Projetos e Trabalhos Desenvolvidos" }
        })

        fireEvent.change(screen.getByLabelText(/título/i), {
            target: { value: "Projeto com links" }
        })

        fireEvent.change(screen.getByLabelText(/descrição das atividades/i), {
            target: { value: "Descrição do projeto desenvolvido" }
        })

        fireEvent.change(screen.getByLabelText("Link 1"), {
            target: { value: "https://github.com/" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByText(/sucesso/i))
            .toBeInTheDocument()

        const dados = fetch.mock.calls[1][1].body

        expect(JSON.parse(dados.get("links_evidencias")))
            .toEqual(["https://github.com/"])

        expect(dados.getAll("evidencia_visual"))
            .toHaveLength(0)

    })

    test("Deve cadastrar registro com vídeo e link", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => areas
        }).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => ({
                id_registro: "registro_video"
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
            target: { value: "Projetos e Trabalhos Desenvolvidos" }
        })

        fireEvent.change(screen.getByLabelText(/título/i), {
            target: { value: "Projeto com vídeo" }
        })

        fireEvent.change(screen.getByLabelText(/descrição das atividades/i), {
            target: { value: "Descrição do projeto desenvolvido" }
        })

        const video = new File(
            ["Vídeo de teste"],
            "projeto.mp4",
            { type: "video/mp4" }
        )

        fireEvent.change(screen.getByLabelText(/evidências/i), {
            target: { files: [video] }
        })

        fireEvent.change(screen.getByLabelText("Link 1"), {
            target: { value: "https://github.com/" }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByText(/sucesso/i))
            .toBeInTheDocument()

        const dados = fetch.mock.calls[1][1].body

        expect(dados.getAll("evidencia_visual"))
            .toHaveLength(1)

        expect(dados.get("evidencia_visual").name)
            .toBe("projeto.mp4")

        expect(JSON.parse(dados.get("links_evidencias")))
            .toEqual(["https://github.com/"])

    })

    test("Deve impedir o envio de vídeo acima de 100 MB", async () => {

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
            target: { value: "Projetos e Trabalhos Desenvolvidos" }
        })

        fireEvent.change(screen.getByLabelText(/título/i), {
            target: { value: "Projeto com vídeo" }
        })

        fireEvent.change(screen.getByLabelText(/descrição das atividades/i), {
            target: { value: "Descrição do projeto desenvolvido" }
        })

        const video = new File(
            ["Vídeo de teste"],
            "projeto.mp4",
            { type: "video/mp4" }
        )

        Object.defineProperty(video, "size", {
            value: 101 * 1024 * 1024
        })

        fireEvent.change(screen.getByLabelText(/evidências/i), {
            target: { files: [video] }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByText(
            /(?:máximo|até).*100 MB/i,
            { selector: '[role="status"]' }
        )).toBeInTheDocument()

        expect(fetch).toHaveBeenCalledTimes(1)

    })

    test("Deve impedir o envio de imagem acima de 20 MB", async () => {

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
            target: { value: "Projetos e Trabalhos Desenvolvidos" }
        })

        fireEvent.change(screen.getByLabelText(/título/i), {
            target: { value: "Projeto com imagem" }
        })

        fireEvent.change(screen.getByLabelText(/descrição das atividades/i), {
            target: { value: "Descrição do projeto desenvolvido" }
        })

        const imagem = new File(
            ["Imagem de teste"],
            "projeto.png",
            { type: "image/png" }
        )

        Object.defineProperty(imagem, "size", {
            value: 21 * 1024 * 1024
        })

        fireEvent.change(screen.getByLabelText(/evidências/i), {
            target: { files: [imagem] }
        })

        fireEvent.click(
            screen.getByRole("button", { name: /cadastrar/i })
        )

        expect(await screen.findByRole("status"))
            .toHaveTextContent(/20 MB/i)

        expect(fetch).toHaveBeenCalledTimes(1)

    })

})