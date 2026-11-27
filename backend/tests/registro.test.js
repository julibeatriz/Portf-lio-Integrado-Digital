import "dotenv/config"
import { describe, test, expect, beforeAll, afterAll } from "vitest"
import request from "supertest"
import { randomUUID } from "node:crypto"
import app from "../src/app.js"

let token
let id_area
let id_registro
let id_area_senai
let id_registro_senai
let id_registro_anual
let id_registro_reflexao
let id_registro_participacao

beforeAll(async () => {

    const login = await request(app)
        .post("/api/login")
        .send({
            email: process.env.ADMIN_EMAIL,
            senha: process.env.ADMIN_SENHA
        })

    expect(login.status).toBe(200)

    token = login.body.token

    const area = await request(app)
        .post("/api/areas")
        .set("Authorization", `Bearer ${token}`)
        .send({
            instituicao: "Sesi",
            nome: "Área para teste de registros",
            descricao: "Área criada durante os testes"
        })

    id_area = area.body.id_area

    expect(area.status).toBe(201)
    expect(id_area).toBeDefined()

    const areaSenai = await request(app)
        .post("/api/areas")
        .set("Authorization", `Bearer ${token}`)
        .send({
            instituicao: "Senai",
            nome: "Área SENAI de teste",
            descricao: "Área criada durante os testes"
        })

    id_area_senai = areaSenai.body.id_area

    expect(areaSenai.status).toBe(201)
    expect(id_area_senai).toBeDefined()

})

describe("GET /api/registros", () => {

    test("Deve listar os registros", async () => {

        const response = await request(app)
            .get("/api/registros")

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBeTruthy()

    })

})

describe("POST /api/registros", () => {

    test("Deve cadastrar um registro", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Fundamentos Teóricos",
                bimestre: "1º Bimestre",
                titulo: "Registro de teste",
                descricao: "Descrição do registro de teste",
                aprendizado: "Aprendizado adquirido durante a atividade"
            })

        id_registro = response.body.id_registro

        expect(response.status).toBe(201)
        expect(id_registro).toBeDefined()
        expect(response.body.bimestre).toBe("1º Bimestre")
        expect(response.body.aprendizado).toBe("Aprendizado adquirido durante a atividade")

    })

    test("Deve retornar erro sem título", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Fundamentos Teóricos",
                bimestre: "1º Bimestre",
                descricao: "Descrição do registro de teste"
            })

        expect(response.status).toBe(400)

    })

    test("Deve retornar erro sem descrição", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Fundamentos Teóricos",
                bimestre: "1º Bimestre",
                titulo: "Registro de teste"
            })

        expect(response.status).toBe(400)

    })

    test("Deve retornar erro sem token", async () => {

        const response = await request(app)
            .post("/api/registros")
            .send({
                id_area: id_area,
                secao: "Fundamentos Teóricos",
                bimestre: "1º Bimestre",
                titulo: "Registro de teste",
                descricao: "Descrição do registro de teste"
            })

        expect(response.status).toBe(401)

    })

    test("Deve retornar erro com área inexistente", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: -1,
                secao: "Fundamentos Teóricos",
                bimestre: "1º Bimestre",
                titulo: "Registro de teste",
                descricao: "Descrição do registro de teste"
            })

        expect(response.status).toBe(404)

    })

    test("Deve retornar erro sem área", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                secao: "Fundamentos Teóricos",
                bimestre: "1º Bimestre",
                titulo: "Registro de teste",
                descricao: "Descrição do registro de teste"
            })

        expect(response.status).toBe(400)

    })

    test("Deve retornar erro sem seção", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                bimestre: "1º Bimestre",
                titulo: "Registro de teste",
                descricao: "Descrição do registro de teste"
            })

        expect(response.status).toBe(400)

    })

    test("Deve retornar erro ao cadastrar SESI sem bimestre", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Fundamentos Teóricos",
                titulo: "Registro de teste",
                descricao: "Descrição do registro de teste"
            })

        expect(response.status).toBe(400)

    })

    test("Deve retornar erro com bimestre inválido", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Fundamentos Teóricos",
                bimestre: "5º Bimestre",
                titulo: "Registro de teste",
                descricao: "Descrição do registro de teste"
            })

        expect(response.status).toBe(400)

    })

    test("Deve cadastrar registro do SENAI sem bimestre", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area_senai,
                secao: "Fundamentos Teóricos",
                titulo: "Registro SENAI",
                descricao: "Descrição da atividade do SENAI"
            })

        id_registro_senai = response.body.id_registro

        expect(response.status).toBe(201)
        expect(id_registro_senai).toBeDefined()
        expect(response.body.bimestre).toBeNull()

    })

    test("Deve cadastrar registro anual do SESI sem título e sem bimestre", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Reflexão Crítica",
                descricao: "Descrição do registro anual"
            })

        id_registro_anual = response.body.id_registro

        expect(response.status).toBe(201)
        expect(id_registro_anual).toBeDefined()
        expect(response.body.titulo).toBe("Reflexão Crítica")
        expect(response.body.bimestre).toBeNull()

    })

    test("Deve cadastrar evidência em seção permitida", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .field("id_area", id_area)
            .field("secao", "Participação em Sala de Aula")
            .field("bimestre", "1º Bimestre")
            .field("titulo", "Registro com evidência")
            .field("descricao", "Descrição da atividade")
            .field("reflexao_pratica", "Aplicação dos conhecimentos estudados")
            .field("autoavaliacao", "Participação nas atividades propostas")
            .attach("evidencia_visual", Buffer.from("Arquivo de teste"), "teste.pdf")

        if(response.body.id_registro){

            const exclusao = await request(app)
                .delete(`/api/registros/${response.body.id_registro}`)
                .set("Authorization", `Bearer ${token}`)

            expect(exclusao.status).toBe(200)

        }

        expect(response.status).toBe(201)
        expect(response.body.evidencia_visual).toHaveLength(1)

    })

    test("Deve retornar erro ao cadastrar evidência em seção não permitida", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .field("id_area", id_area)
            .field("secao", "Fundamentos Teóricos")
            .field("bimestre", "1º Bimestre")
            .field("titulo", "Registro de teste")
            .field("descricao", "Descrição da atividade")
            .attach("evidencia_visual", Buffer.from("Arquivo de teste"), "teste.pdf")

        if(response.body.id_registro){

            const exclusao = await request(app)
                .delete(`/api/registros/${response.body.id_registro}`)
                .set("Authorization", `Bearer ${token}`)

            expect(exclusao.status).toBe(200)

        }

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Esta seção não permite evidências")

    })

})

describe("GET /api/registros/:id", () => {

    test("Deve buscar um registro pelo ID", async () => {

        expect(id_registro).toBeDefined()

        const response = await request(app)
            .get(`/api/registros/${id_registro}`)

        expect(response.status).toBe(200)
        expect(response.body.titulo).toBe("Registro de teste")

    })

    test("Deve retornar erro ao buscar registro inexistente", async () => {

        const response = await request(app)
            .get(`/api/registros/${randomUUID()}`)

        expect(response.status).toBe(404)

    })

})

describe("PUT /api/registros/:id", () => {

    test("Deve retornar erro ao atualizar sem token", async () => {

        expect(id_registro).toBeDefined()

        const response = await request(app)
            .put(`/api/registros/${id_registro}`)
            .send({
                titulo: "Registro atualizado"
            })

        expect(response.status).toBe(401)

    })

    test("Deve retornar erro ao atualizar sem título", async () => {

        expect(id_registro).toBeDefined()

        const response = await request(app)
            .put(`/api/registros/${id_registro}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Fundamentos Teóricos",
                bimestre: "1º Bimestre",
                descricao: "Descrição atualizada"
            })

        expect(response.status).toBe(400)

    })

    test("Deve retornar erro ao atualizar sem descrição", async () => {

        expect(id_registro).toBeDefined()

        const response = await request(app)
            .put(`/api/registros/${id_registro}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Fundamentos Teóricos",
                bimestre: "1º Bimestre",
                titulo: "Registro atualizado"
            })

        expect(response.status).toBe(400)

    })

    test("Deve retornar erro ao atualizar registro inexistente", async () => {

        const response = await request(app)
            .put(`/api/registros/${randomUUID()}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Fundamentos Teóricos",
                bimestre: "2º Bimestre",
                titulo: "Registro atualizado",
                descricao: "Descrição atualizada"
            })

        expect(response.status).toBe(404)

    })

    test("Deve atualizar um registro", async () => {

        expect(id_registro).toBeDefined()

        const response = await request(app)
            .put(`/api/registros/${id_registro}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Fundamentos Teóricos",
                bimestre: "2º Bimestre",
                titulo: "Registro atualizado",
                descricao: "Descrição atualizada",
                aprendizado: "Aprendizado atualizado durante os testes"
            })

        expect(response.status).toBe(200)
        expect(response.body.titulo).toBe("Registro atualizado")
        expect(response.body.bimestre).toBe("2º Bimestre")
        expect(response.body.aprendizado).toBe("Aprendizado atualizado durante os testes")

    })

    test("Deve atualizar registro do SENAI sem bimestre", async () => {

        const response = await request(app)
            .put(`/api/registros/${id_registro_senai}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area_senai,
                secao: "Fundamentos Teóricos",
                titulo: "Registro SENAI atualizado",
                descricao: "Descrição atualizada"
            })

        expect(response.status).toBe(200)
        expect(response.body.bimestre).toBeNull()

    })

    test("Deve atualizar registro anual sem título e sem bimestre", async () => {

        expect(id_registro_anual).toBeDefined()

        const response = await request(app)
            .put(`/api/registros/${id_registro_anual}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Conexões Interdisciplinares",
                descricao: "Descrição atualizada"
            })

        expect(response.status).toBe(200)
        expect(response.body.titulo).toBe("Conexões Interdisciplinares")
        expect(response.body.bimestre).toBeNull()

    })

    test("Deve ignorar bimestre e título personalizado em seção anual", async () => {

        expect(id_registro_anual).toBeDefined()

        const response = await request(app)
            .put(`/api/registros/${id_registro_anual}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Aprendizados da Escola para a Vida",
                bimestre: "1º Bimestre",
                titulo: "Registro anual atualizado",
                descricao: "Descrição atualizada"
            })

        expect(response.status).toBe(200)
        expect(response.body.titulo).toBe("Aprendizados da Escola para a Vida")
        expect(response.body.bimestre).toBeNull()

    })

    test("Deve retornar erro ao atualizar evidência em seção não permitida", async () => {

        const response = await request(app)
            .put(`/api/registros/${id_registro}`)
            .set("Authorization", `Bearer ${token}`)
            .field("id_area", id_area)
            .field("secao", "Fundamentos Teóricos")
            .field("bimestre", "2º Bimestre")
            .field("titulo", "Registro atualizado")
            .field("descricao", "Descrição atualizada")
            .attach("evidencia_visual", Buffer.from("Arquivo de teste"), "teste.pdf")

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Esta seção não permite evidências")

    })

})

describe("PATCH /api/registros/:id", () => {

    test("Deve atualizar parcialmente um registro", async () => {

        expect(id_registro).toBeDefined()

        const response = await request(app)
            .patch(`/api/registros/${id_registro}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                titulo: "Título atualizado parcialmente"
            })

        expect(response.status).toBe(200)
        expect(response.body.titulo).toBe("Título atualizado parcialmente")
        expect(response.body.descricao).toBe("Descrição atualizada")
        expect(response.body.bimestre).toBe("2º Bimestre")

    })

    test("Deve retornar erro ao atualizar parcialmente sem token", async () => {

        expect(id_registro).toBeDefined()

        const response = await request(app)
            .patch(`/api/registros/${id_registro}`)
            .send({
                titulo: "Novo título"
            })

        expect(response.status).toBe(401)

    })

    test("Deve retornar erro ao atualizar parcialmente registro inexistente", async () => {

        const response = await request(app)
            .patch(`/api/registros/${randomUUID()}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                titulo: "Novo título"
            })

        expect(response.status).toBe(404)

    })

    test("Deve retornar erro ao informar título vazio", async () => {

        expect(id_registro).toBeDefined()

        const response = await request(app)
            .patch(`/api/registros/${id_registro}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                titulo: ""
            })

        expect(response.status).toBe(400)

    })

    test("Deve retornar erro ao alterar seção anual para bimestral sem bimestre", async () => {

        expect(id_registro_anual).toBeDefined()

        const response = await request(app)
            .patch(`/api/registros/${id_registro_anual}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                secao: "Fundamentos Teóricos"
            })

        expect(response.status).toBe(400)

    })

    test("Deve alterar seção anual para bimestral", async () => {

        expect(id_registro_anual).toBeDefined()

        const response = await request(app)
            .patch(`/api/registros/${id_registro_anual}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                secao: "Fundamentos Teóricos",
                bimestre: "1º Bimestre",
                titulo: "Registro bimestral"
            })

        expect(response.status).toBe(200)
        expect(response.body.secao).toBe("Fundamentos Teóricos")
        expect(response.body.bimestre).toBe("1º Bimestre")
        expect(response.body.titulo).toBe("Registro bimestral")

    })

    test("Deve alterar seção bimestral para anual", async () => {

        expect(id_registro_anual).toBeDefined()

        const response = await request(app)
            .patch(`/api/registros/${id_registro_anual}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                secao: "Reflexão Crítica"
            })

        expect(response.status).toBe(200)
        expect(response.body.secao).toBe("Reflexão Crítica")
        expect(response.body.titulo).toBe("Reflexão Crítica")
        expect(response.body.bimestre).toBeNull()

    })

    test("Deve retornar erro ao adicionar evidência em seção não permitida", async () => {

        const response = await request(app)
            .patch(`/api/registros/${id_registro}`)
            .set("Authorization", `Bearer ${token}`)
            .attach("evidencia_visual", Buffer.from("Arquivo de teste"), "teste.pdf")

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Esta seção não permite evidências")

    })

})

describe("Campos específicos das seções", () => {

    test("Deve cadastrar os campos da Reflexão Crítica", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Reflexão Crítica",
                descricao: "Conhecimentos adquiridos durante o ano",
                reflexao_pratica: "Aplicação dos conhecimentos no cotidiano",
                melhorias_necessarias: "Melhorar a organização dos estudos"
            })

        id_registro_reflexao = response.body.id_registro

        expect(response.status).toBe(201)
        expect(id_registro_reflexao).toBeDefined()
        expect(response.body.titulo).toBe("Reflexão Crítica")
        expect(response.body.bimestre).toBeNull()
        expect(response.body.reflexao_pratica).toBe("Aplicação dos conhecimentos no cotidiano")
        expect(response.body.melhorias_necessarias).toBe("Melhorar a organização dos estudos")

    })

    test("Deve buscar os campos da Reflexão Crítica", async () => {

        expect(id_registro_reflexao).toBeDefined()

        const response = await request(app)
            .get(`/api/registros/${id_registro_reflexao}`)

        expect(response.status).toBe(200)
        expect(response.body.descricao).toBe("Conhecimentos adquiridos durante o ano")
        expect(response.body.reflexao_pratica).toBe("Aplicação dos conhecimentos no cotidiano")
        expect(response.body.melhorias_necessarias).toBe("Melhorar a organização dos estudos")

    })

    test("Deve atualizar os campos da Reflexão Crítica", async () => {

        expect(id_registro_reflexao).toBeDefined()

        const response = await request(app)
            .put(`/api/registros/${id_registro_reflexao}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Reflexão Crítica",
                descricao: "Aprendizado acadêmico atualizado",
                reflexao_pratica: "Aplicação prática atualizada",
                melhorias_necessarias: "Melhorias atualizadas"
            })

        expect(response.status).toBe(200)
        expect(response.body.titulo).toBe("Reflexão Crítica")
        expect(response.body.bimestre).toBeNull()
        expect(response.body.descricao).toBe("Aprendizado acadêmico atualizado")
        expect(response.body.reflexao_pratica).toBe("Aplicação prática atualizada")
        expect(response.body.melhorias_necessarias).toBe("Melhorias atualizadas")

    })

    test("Deve cadastrar Participação em Sala de Aula com autoavaliação", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Participação em Sala de Aula",
                bimestre: "1º Bimestre",
                titulo: "Atividade em sala",
                descricao: "Atividade realizada durante a aula",
                reflexao_pratica: "Aplicação dos conceitos estudados",
                autoavaliacao: "Participei das atividades propostas"
            })

        id_registro_participacao = response.body.id_registro

        expect(response.status).toBe(201)
        expect(id_registro_participacao).toBeDefined()
        expect(response.body.titulo).toBe("Atividade em sala")
        expect(response.body.bimestre).toBe("1º Bimestre")
        expect(response.body.reflexao_pratica).toBe("Aplicação dos conceitos estudados")
        expect(response.body.autoavaliacao).toBe("Participei das atividades propostas")

    })

    test("Deve atualizar parcialmente a autoavaliação", async () => {

        expect(id_registro_participacao).toBeDefined()

        const response = await request(app)
            .patch(`/api/registros/${id_registro_participacao}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                autoavaliacao: "Autoavaliação atualizada"
            })

        expect(response.status).toBe(200)
        expect(response.body.autoavaliacao).toBe("Autoavaliação atualizada")
        expect(response.body.reflexao_pratica).toBe("Aplicação dos conceitos estudados")
        expect(response.body.titulo).toBe("Atividade em sala")
        expect(response.body.bimestre).toBe("1º Bimestre")

    })

    test("Deve cadastrar Conexões Interdisciplinares sem título", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Conexões Interdisciplinares",
                descricao: "Relação entre matemática e programação"
            })

        if(response.body.id_registro){

            const exclusao = await request(app)
                .delete(`/api/registros/${response.body.id_registro}`)
                .set("Authorization", `Bearer ${token}`)

            expect(exclusao.status).toBe(200)

        }

        expect(response.status).toBe(201)
        expect(response.body.titulo).toBe("Conexões Interdisciplinares")
        expect(response.body.bimestre).toBeNull()
        expect(response.body.descricao).toBe("Relação entre matemática e programação")

    })

    test("Deve cadastrar Aprendizados da Escola para a Vida sem título", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Aprendizados da Escola para a Vida",
                descricao: "Importância dos conhecimentos para a vida em sociedade"
            })

        if(response.body.id_registro){

            const exclusao = await request(app)
                .delete(`/api/registros/${response.body.id_registro}`)
                .set("Authorization", `Bearer ${token}`)

            expect(exclusao.status).toBe(200)

        }

        expect(response.status).toBe(201)
        expect(response.body.titulo).toBe("Aprendizados da Escola para a Vida")
        expect(response.body.bimestre).toBeNull()
        expect(response.body.descricao).toBe("Importância dos conhecimentos para a vida em sociedade")

    })

})

describe("DELETE /api/areas/:id", () => {

    test("Deve impedir a exclusão de área com registros vinculados", async () => {

        expect(id_area).toBeDefined()
        expect(id_registro).toBeDefined()

        const response = await request(app)
            .delete(`/api/areas/${id_area}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(409)

    })

})

describe("DELETE /api/registros/:id", () => {

    test("Deve retornar erro ao excluir sem token", async () => {

        expect(id_registro).toBeDefined()

        const response = await request(app)
            .delete(`/api/registros/${id_registro}`)

        expect(response.status).toBe(401)

    })

    test("Deve excluir um registro", async () => {

        expect(id_registro).toBeDefined()

        const response = await request(app)
            .delete(`/api/registros/${id_registro}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)

    })

    test("Deve retornar erro ao buscar registro excluído", async () => {

        expect(id_registro).toBeDefined()

        const response = await request(app)
            .get(`/api/registros/${id_registro}`)

        expect(response.status).toBe(404)

    })

    test("Deve retornar erro ao excluir registro inexistente", async () => {

        const response = await request(app)
            .delete(`/api/registros/${randomUUID()}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(404)

    })

})

describe("Vídeos e links das evidências", () => {

    test("Deve cadastrar registro com vídeo MP4", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .field("id_area", id_area)
            .field("secao", "Projetos e Trabalhos Desenvolvidos")
            .field("bimestre", "1º Bimestre")
            .field("titulo", "Projeto com vídeo MP4")
            .field("descricao", "Descrição do projeto desenvolvido")
            .attach("evidencia_visual", Buffer.from("Vídeo de teste"), "teste.mp4")

        if(response.body.id_registro){

            const exclusao = await request(app)
                .delete(`/api/registros/${response.body.id_registro}`)
                .set("Authorization", `Bearer ${token}`)

            expect(exclusao.status).toBe(200)

        }

        expect(response.status).toBe(201)
        expect(response.body.evidencia_visual).toHaveLength(1)
        expect(response.body.evidencia_visual[0]).toMatch(/\.mp4$/)

    })

    test("Deve cadastrar registro com vídeo WebM", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .field("id_area", id_area)
            .field("secao", "Projetos e Trabalhos Desenvolvidos")
            .field("bimestre", "1º Bimestre")
            .field("titulo", "Projeto com vídeo WebM")
            .field("descricao", "Descrição do projeto desenvolvido")
            .attach("evidencia_visual", Buffer.from("Vídeo de teste"), "teste.webm")

        if(response.body.id_registro){

            const exclusao = await request(app)
                .delete(`/api/registros/${response.body.id_registro}`)
                .set("Authorization", `Bearer ${token}`)

            expect(exclusao.status).toBe(200)

        }

        expect(response.status).toBe(201)
        expect(response.body.evidencia_visual).toHaveLength(1)
        expect(response.body.evidencia_visual[0]).toMatch(/\.webm$/)

    })

    test("Deve cadastrar registro somente com links", async () => {

        const links = [
            "https://github.com/",
            "https://www.youtube.com/"
        ]

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .field("id_area", id_area)
            .field("secao", "Projetos e Trabalhos Desenvolvidos")
            .field("bimestre", "1º Bimestre")
            .field("titulo", "Projeto com links")
            .field("descricao", "Descrição do projeto desenvolvido")
            .field("links_evidencias", JSON.stringify(links))

        if(response.body.id_registro){

            const exclusao = await request(app)
                .delete(`/api/registros/${response.body.id_registro}`)
                .set("Authorization", `Bearer ${token}`)

            expect(exclusao.status).toBe(200)

        }

        expect(response.status).toBe(201)
        expect(response.body.links_evidencias).toEqual(links)
        expect(response.body.evidencia_visual || []).toHaveLength(0)

    })

    test("Deve cadastrar arquivos e links no mesmo registro", async () => {

        const links = ["https://github.com/"]

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .field("id_area", id_area)
            .field("secao", "Projetos e Trabalhos Desenvolvidos")
            .field("bimestre", "1º Bimestre")
            .field("titulo", "Projeto com evidências")
            .field("descricao", "Descrição do projeto desenvolvido")
            .field("links_evidencias", JSON.stringify(links))
            .attach("evidencia_visual", Buffer.from("Imagem de teste"), "teste.png")
            .attach("evidencia_visual", Buffer.from("Documento de teste"), "teste.pdf")
            .attach("evidencia_visual", Buffer.from("Vídeo de teste"), "teste.mp4")

        if(response.body.id_registro){

            const exclusao = await request(app)
                .delete(`/api/registros/${response.body.id_registro}`)
                .set("Authorization", `Bearer ${token}`)

            expect(exclusao.status).toBe(200)

        }

        expect(response.status).toBe(201)
        expect(response.body.evidencia_visual).toHaveLength(3)
        expect(response.body.links_evidencias).toEqual(links)

    })

    test("Deve retornar erro ao cadastrar link inválido", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Projetos e Trabalhos Desenvolvidos",
                bimestre: "1º Bimestre",
                titulo: "Projeto com link inválido",
                descricao: "Descrição do projeto desenvolvido",
                links_evidencias: ["link-invalido"]
            })

        expect(response.status).toBe(400)

    })

    test("Deve retornar erro ao cadastrar link com protocolo não permitido", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Projetos e Trabalhos Desenvolvidos",
                bimestre: "1º Bimestre",
                titulo: "Projeto com link inválido",
                descricao: "Descrição do projeto desenvolvido",
                links_evidencias: ["ftp://example.com/"]
            })

        expect(response.status).toBe(400)

    })

    test("Deve retornar erro ao cadastrar mais de 10 links", async () => {

        const links = Array.from(
            { length: 11 },
            (_, indice) => `https://example.com/${indice}`
        )

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Projetos e Trabalhos Desenvolvidos",
                bimestre: "1º Bimestre",
                titulo: "Projeto com muitos links",
                descricao: "Descrição do projeto desenvolvido",
                links_evidencias: links
            })

        expect(response.status).toBe(400)

    })

    test("Deve retornar erro ao cadastrar links em seção não permitida", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Fundamentos Teóricos",
                bimestre: "1º Bimestre",
                titulo: "Registro de teste",
                descricao: "Descrição da atividade",
                links_evidencias: ["https://github.com/"]
            })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Esta seção não permite evidências")

    })

    test("Deve atualizar os links de um registro", async () => {

        expect(id_registro_participacao).toBeDefined()

        const links = [
            "https://github.com/",
            "https://www.youtube.com/"
        ]

        const response = await request(app)
            .put(`/api/registros/${id_registro_participacao}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                id_area: id_area,
                secao: "Participação em Sala de Aula",
                bimestre: "1º Bimestre",
                titulo: "Atividade em sala",
                descricao: "Atividade realizada durante a aula",
                reflexao_pratica: "Aplicação dos conceitos estudados",
                autoavaliacao: "Participação nas atividades propostas",
                links_evidencias: links
            })

        expect(response.status).toBe(200)
        expect(response.body.links_evidencias).toEqual(links)

    })

    test("Deve buscar os links cadastrados no registro", async () => {

        expect(id_registro_participacao).toBeDefined()

        const response = await request(app)
            .get(`/api/registros/${id_registro_participacao}`)

        expect(response.status).toBe(200)
        expect(response.body.links_evidencias).toEqual([
            "https://github.com/",
            "https://www.youtube.com/"
        ])

    })

    test("Deve preservar os links durante atualização parcial", async () => {

        expect(id_registro_participacao).toBeDefined()

        const response = await request(app)
            .patch(`/api/registros/${id_registro_participacao}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                titulo: "Atividade atualizada"
            })

        expect(response.status).toBe(200)
        expect(response.body.titulo).toBe("Atividade atualizada")
        expect(response.body.links_evidencias).toEqual([
            "https://github.com/",
            "https://www.youtube.com/"
        ])

    })

    test("Deve atualizar parcialmente os links", async () => {

        expect(id_registro_participacao).toBeDefined()

        const response = await request(app)
            .patch(`/api/registros/${id_registro_participacao}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                links_evidencias: ["https://www.figma.com/"]
            })

        expect(response.status).toBe(200)
        expect(response.body.links_evidencias).toEqual([
            "https://www.figma.com/"
        ])

    })

    test("Deve remover todos os links de um registro", async () => {

        expect(id_registro_participacao).toBeDefined()

        const response = await request(app)
            .patch(`/api/registros/${id_registro_participacao}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                links_evidencias: []
            })

        expect(response.status).toBe(200)
        expect(response.body.links_evidencias).toHaveLength(0)

    })

    test("Deve retornar erro ao enviar imagem acima de 20 MB", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .field("id_area", id_area)
            .field("secao", "Projetos e Trabalhos Desenvolvidos")
            .field("bimestre", "1º Bimestre")
            .field("titulo", "Projeto com imagem")
            .field("descricao", "Descrição do projeto desenvolvido")
            .attach(
                "evidencia_visual",
                Buffer.alloc(21 * 1024 * 1024),
                "teste.png"
            )

        expect(response.status).toBe(400)

    }, 30000)

    test("Deve retornar erro ao enviar documento acima de 20 MB", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .field("id_area", id_area)
            .field("secao", "Projetos e Trabalhos Desenvolvidos")
            .field("bimestre", "1º Bimestre")
            .field("titulo", "Projeto com documento")
            .field("descricao", "Descrição do projeto desenvolvido")
            .attach(
                "evidencia_visual",
                Buffer.alloc(21 * 1024 * 1024),
                "teste.pdf"
            )

        expect(response.status).toBe(400)

    }, 30000)

    test("Deve retornar erro ao enviar vídeo acima de 100 MB", async () => {

        const response = await request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .field("id_area", id_area)
            .field("secao", "Projetos e Trabalhos Desenvolvidos")
            .field("bimestre", "1º Bimestre")
            .field("titulo", "Projeto com vídeo")
            .field("descricao", "Descrição do projeto desenvolvido")
            .attach(
                "evidencia_visual",
                Buffer.alloc(101 * 1024 * 1024),
                "teste.mp4"
            )

        expect(response.status).toBe(400)
        expect(response.body.message).toBe(
            "Cada arquivo deve ter no máximo 100 MB"
        )

    }, 30000)

    test("Deve retornar erro ao enviar mais de 10 arquivos", async () => {

        const requisicao = request(app)
            .post("/api/registros")
            .set("Authorization", `Bearer ${token}`)
            .field("id_area", id_area)
            .field("secao", "Projetos e Trabalhos Desenvolvidos")
            .field("bimestre", "1º Bimestre")
            .field("titulo", "Projeto com muitos arquivos")
            .field("descricao", "Descrição do projeto desenvolvido")

        for(let i = 0; i < 11; i++){

            requisicao.attach(
                "evidencia_visual",
                Buffer.from("Arquivo de teste"),
                `teste-${i}.pdf`
            )

        }

        const response = await requisicao

        expect(response.status).toBe(400)

    })

})

afterAll(async () => {

    if(id_registro && token){

        const response = await request(app)
            .delete(`/api/registros/${id_registro}`)
            .set("Authorization", `Bearer ${token}`)

        expect([200, 404]).toContain(response.status)

    }

    if(id_registro_senai && token){

        const response = await request(app)
            .delete(`/api/registros/${id_registro_senai}`)
            .set("Authorization", `Bearer ${token}`)

        expect([200, 404]).toContain(response.status)

    }

    if(id_registro_anual && token){

        const response = await request(app)
            .delete(`/api/registros/${id_registro_anual}`)
            .set("Authorization", `Bearer ${token}`)

        expect([200, 404]).toContain(response.status)

    }

    if(id_registro_reflexao && token){

        const response = await request(app)
            .delete(`/api/registros/${id_registro_reflexao}`)
            .set("Authorization", `Bearer ${token}`)

        expect([200, 404]).toContain(response.status)

    }

    if(id_registro_participacao && token){

        const response = await request(app)
            .delete(`/api/registros/${id_registro_participacao}`)
            .set("Authorization", `Bearer ${token}`)

        expect([200, 404]).toContain(response.status)

    }

    if(id_area && token){

        const response = await request(app)
            .delete(`/api/areas/${id_area}`)
            .set("Authorization", `Bearer ${token}`)

        expect([200, 404]).toContain(response.status)

    }

    if(id_area_senai && token){

        const response = await request(app)
            .delete(`/api/areas/${id_area_senai}`)
            .set("Authorization", `Bearer ${token}`)

        expect([200, 404]).toContain(response.status)

    }

})