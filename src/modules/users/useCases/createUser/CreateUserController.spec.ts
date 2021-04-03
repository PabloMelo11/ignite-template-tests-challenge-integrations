import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";

import createConnection from "../../../../database";

let connection: Connection;

describe("Create user", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("it should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "john",
      email: "john1@test.com.br",
      password: "123456",
    });

    expect(response.status).toBe(201);
  });
});
