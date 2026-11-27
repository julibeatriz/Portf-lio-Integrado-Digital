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