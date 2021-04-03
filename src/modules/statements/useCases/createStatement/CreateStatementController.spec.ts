import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";

import createConnection from "../../../../database";

let connection: Connection;

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should be able to create a new statement deposit", async () => {
    await request(app).post("/api/v1/users").send({
      name: "john",
      email: "john3@test.com.br",
      password: "123456",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "john3@test.com.br",
      password: "123456",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 10,
        description: "new deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("should be able to create a new statement withdraw", async () => {
    await request(app).post("/api/v1/users").send({
      name: "john",
      email: "john4@test.com.br",
      password: "123456",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "john4@test.com.br",
      password: "123456",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 20,
        description: "new deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 10,
        description: "new deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });
});
