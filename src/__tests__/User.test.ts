import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";
import createConnection from "../database";

describe("Users", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    // Remove todas as tabelas do database de teste depois de executar todos os testes
    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    })

    it("Should be able to create a new user", async () => {
        const response = await request(app).post("/users").send({
            name: "User Example",
            email: "user@example.com",
        });
        
        expect(response.status).toBe(201);
    });

    it("Should not be able to create a user with exists email", async () => {
        const response = await request(app).post("/users").send({
            name: "User Example",
            email: "user@example.com",
        });
        
        expect(response.status).toBe(400);
    });
})