import request from "supertest";
import { Roles } from "@reward-sys/common";

import { app } from "../../src/app";
import { API } from "../../src/constants/api";
import { createAccount } from "../utils/auth";

const url = `${API.BASE_URL}${API.AUTH}${API.LOGIN}`;


describe(`Login SUCCESS Test Cases : POST ${url}`, () => {
  it("Respond with cookie for valid credentials", async () => {
    await createAccount("test@test.com", "password", Roles.Employee);

    const response = await request(app)
      .post(url)
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe(`Login VALIDATION Test Cases : POST ${url}`, () => {
  it("Returns 400 for Invalid Email", async () => {
    return request(app)
      .post(url)
      .send({
        email: "test",
        password: "password",
      })
      .expect(400);
  });
  it("Returns 400 for Password length less than 8 characters", async () => {
    return request(app)
      .post(url)
      .send({
        email: "test@test.com",
        password: "1234567",
      })
      .expect(400);
  });

  it("Returns 400 for empty request body", async () => {
    await request(app).post(url).send({}).expect(400);
  });

  it("Returns 400 for not providing email", async () => {
    await request(app)
      .post(url)
      .send({
        password: "12345678",
      })
      .expect(400);
  });

  it("Returns 400 for not providing password", async () => {
    await request(app)
      .post(url)
      .send({
        email: "test@test.com",
      })
      .expect(400);
  });
});

describe(`Login FAILURE Test Cases : POST ${url}`, () => {
  it("Returns 401 for Non-Existing Email", async () => {
    return request(app)
      .post(url)
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(401);
  });

  it("Returns 400 for Incorrect Password", async () => {
    await createAccount("test@test.com", "password", Roles.Employee);
    await request(app)
      .post(url)
      .send({
        email: "test@test.com",
        password: "wrong password",
      })
      .expect(400);
  });
});
