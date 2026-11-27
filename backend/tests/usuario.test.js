import "dotenv/config"
import { describe, test, expect } from "vitest"
import request from "supertest"
import app from "../src/app.js"

describe("POST /api/login", () => {

    test("Deve realizar login com sucesso", async () => {

        const response = await request(app)
            .post("/api/login")
            .send({
                email: process.env.ADMIN_EMAIL,
                senha: process.env.ADMIN_SENHA
            })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("token")

    })

    test("Deve retornar erro com senha incorreta", async () => {

        const response = await request(app)
            .post("/api/login")
            .send({
                email: process.env.ADMIN_EMAIL,
                senha: "senha_incorreta"
            })

        expect(response.status).toBe(401)

    })

    test("Deve retornar erro sem informar os campos obrigatórios", async () => {

        const response = await request(app)
            .post("/api/login")
            .send({})

        expect(response.status).toBe(400)

    })

})