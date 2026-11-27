import "dotenv/config"
import { describe, test, expect, beforeAll, afterAll } from "vitest"
import request from "supertest"
import app from "../src/app.js"

let token
let id_area

beforeAll(async () => {

    const response = await request(app)
        .post("/api/login")
        .send({
            email: process.env.ADMIN_EMAIL,
            senha: process.env.ADMIN_SENHA
        })

    expect(response.status).toBe(200)

    token = response.body.token

})

describe("GET /api/areas", () => {

    test("Deve listar as áreas", async () => {

        const response = await request(app)
            .get("/api/areas")

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBeTruthy()

    })

})

describe("POST /api/areas", () => {

    test("Deve cadastrar uma área", async () => {

        const response = await request(app)
            .post("/api/areas")
            .set("Authorization", `Bearer ${token}`)
            .send({
                instituicao: "Sesi",
                nome: "Área de teste",
                descricao: "Área criada durante os testes"
            })

        id_area = response.body.id_area

        expect(response.status).toBe(201)
        expect(id_area).toBeDefined()

    })

    test("Deve retornar erro sem nome", async () => {

        const response = await request(app)
            .post("/api/areas")
            .set("Authorization", `Bearer ${token}`)
            .send({
                instituicao: "Sesi"
            })

        expect(response.status).toBe(400)

    })

    test("Deve retornar erro sem token", async () => {

        const response = await request(app)
            .post("/api/areas")
            .send({
                instituicao: "Sesi",
                nome: "Área de teste"
            })

        expect(response.status).toBe(401)

    })

    test("Deve retornar erro sem instituição", async () => {

        const response = await request(app)
            .post("/api/areas")
            .set("Authorization", `Bearer ${token}`)
            .send({
                nome: "Área de teste"
            })

        expect(response.status).toBe(400)

    })

})

describe("GET /api/areas/:id", () => {

    test("Deve buscar uma área pelo ID", async () => {

        expect(id_area).toBeDefined()

        const response = await request(app)
            .get(`/api/areas/${id_area}`)

        expect(response.status).toBe(200)
        expect(response.body.nome).toBe("Área de teste")

    })

})

describe("PUT /api/areas/:id", () => {

    test("Deve retornar erro ao atualizar sem token", async () => {

        expect(id_area).toBeDefined()

        const response = await request(app)
            .put(`/api/areas/${id_area}`)
            .send({
                instituicao: "Sesi",
                nome: "Área atualizada"
            })

        expect(response.status).toBe(401)

    })

    test("Deve retornar erro ao atualizar sem nome", async () => {

        expect(id_area).toBeDefined()

        const response = await request(app)
            .put(`/api/areas/${id_area}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                instituicao: "Sesi"
            })

        expect(response.status).toBe(400)

    })

    test("Deve retornar erro com instituição inválida", async () => {

        expect(id_area).toBeDefined()

        const response = await request(app)
            .put(`/api/areas/${id_area}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                instituicao: "Outra",
                nome: "Área de teste"
            })

        expect(response.status).toBe(400)

    })

    test("Deve atualizar uma área", async () => {

        expect(id_area).toBeDefined()

        const response = await request(app)
            .put(`/api/areas/${id_area}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                instituicao: "Sesi",
                nome: "Área atualizada",
                descricao: "Descrição atualizada"
            })

        expect(response.status).toBe(200)
        expect(response.body.nome).toBe("Área atualizada")

    })

})

describe("DELETE /api/areas/:id", () => {

    test("Deve retornar erro ao excluir sem token", async () => {

        expect(id_area).toBeDefined()

        const response = await request(app)
            .delete(`/api/areas/${id_area}`)

        expect(response.status).toBe(401)

    })

    test("Deve excluir uma área", async () => {

        expect(id_area).toBeDefined()

        const response = await request(app)
            .delete(`/api/areas/${id_area}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)

    })

    test("Deve retornar erro ao buscar área excluída", async () => {

        expect(id_area).toBeDefined()

        const response = await request(app)
            .get(`/api/areas/${id_area}`)

        expect(response.status).toBe(404)

    })

    test("Deve retornar erro ao excluir área inexistente", async () => {

        expect(id_area).toBeDefined()

        const response = await request(app)
            .delete(`/api/areas/${id_area}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(404)

    })

    test("Deve retornar erro ao atualizar área inexistente", async () => {

        expect(id_area).toBeDefined()

        const response = await request(app)
            .put(`/api/areas/${id_area}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                instituicao: "Sesi",
                nome: "Área atualizada"
            })

        expect(response.status).toBe(404)

    })

})

afterAll(async () => {

    if (id_area && token) {

        const response = await request(app)
            .delete(`/api/areas/${id_area}`)
            .set("Authorization", `Bearer ${token}`)

        expect([200, 404]).toContain(response.status)

    }

})