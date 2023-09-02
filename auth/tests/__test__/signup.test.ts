import request from "supertest";
import { Roles } from "@reward-sys/common";

import { app } from "../../src/app";
import { API } from "../../src/constants/api";
import data from "../data/auth";
import { createAccount } from "../utils/auth";

const url = `${API.BASE_URL}${API.AUTH}${API.SIGNUP}`;

describe(`SignUp API SUCCESS Test Cases : POST ${url}`, () => {
  it("Returns 201 on successful signup", async () => {
    return request(app)
      .post(url)
      .send(data.request)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(201);
  });
});

describe(`SignUp VALIDATION Test Cases: POST ${url}`, () => {
  it("Returns 400 for invalid email", async () => {
    const { email, ...rest } = data.request;
    return request(app)
      .post(url)
      .send({
        email: "test",
        ...rest,
      })
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  });

  it("Returns 400 for less than 8 characters password", async () => {
    const { password, ...rest } = data.request;
    return request(app)
      .post(url)
      .send({
        password: "1234567",
        ...rest,
      })
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  });

  it("Returns 400 for invalid Role", async () => {
    const { role, ...rest } = data.request;
    return request(app)
      .post(url)
      .send({
        ...rest,
        role: "Invalid",
      })
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  });

  it("Returns 400 for empty request body", async () => {
    return request(app)
      .post(url)
      .send({})
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  });

  it("Returns 400 for not providing email", async () => {
    return request(app)
      .post(url)
      .send({
        password: data.request.password,
        role: data.request.role,
      })
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  });
  it("Returns 400 for not providing password", async () => {
    return request(app)
      .post(url)
      .send({
        email: data.request.email,
        role: data.request.role,
      })
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  });
  it("Returns 400 for not providing role", async () => {
    return request(app)
      .post(url)
      .send({
        password: data.request.password,
        email: data.request.email,
      })
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  });
});

describe(`SignUp FAILURE Test Cases: POST ${url}`, () => {
  it("Returns 404 If Not Authorized", async () => {
    return request(app).post(url).send(data.request).expect(401);
  });

  it("Returns 403 if Role is not Organization, or permission is now given", async () => {
    await request(app)
      .post(url)
      .send(data.request)
      .set("Cookie", global.signin(Roles.Employee))
      .expect(403);

    await request(app)
      .post(url)
      .send(data.request)
      .set("Cookie", global.signin(Roles.Project))
      .expect(403);
  });

  it("Returns 400 if email already exists", async () => {
    await createAccount(
      data.request.email,
      data.request.password,
      data.request.role
    );
    await request(app)
      .post(url)
      .send(data.request)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  });
});
