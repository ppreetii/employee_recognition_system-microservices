import request from "supertest";

import { app } from "../../src/app";
import { API } from "../../src/constants/api";
import mockData from "../data/employee";
import { Roles } from "@reward-sys/common";
import { createAccount } from "../utils/employee";

const url = `${API.BASE_URL}${API.EMPLOYEE}`;

describe(`Create Employee SUCCESS Test cases: POST ${url}`, () => {
  it("Returns 201 for success employee creation", async () => {
    await createAccount(mockData.validRequest.email);
    return request(app)
      .post(url)
      .send(mockData.validRequest)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(201);
  });
});

describe(`Create Employee VALIDATION Test cases: POST ${url}`, () => {
  it("Returns 400 for invalid request body", async () => {
    return request(app)
      .post(url)
      .send(mockData.invalidRequest)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  });

  it("Returns 400 for missing name, email and contact ", async () => {
    const { email, name, contact, ...rest } = mockData.validRequest;
    return request(app)
      .post(url)
      .send(rest)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  });

  it("Returns 400 for missing birthDate,  personal email and address ", async () => {
    const { birthDate, personal_email, address, ...rest } =
      mockData.validRequest;
    return request(app)
      .post(url)
      .send(rest)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  });

  it("Returns 400 for missing designation", async () => {
    const { designation, ...rest } = mockData.validRequest;
    return request(app)
      .post(url)
      .send(rest)
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
});

describe(`Create Employee FAILURE Test cases: POST ${url}`, () => {
  it("Returns 401 if not logged in", async () => {
    return request(app).post(url).send(mockData.validRequest).expect(401);
  });

  it("Returns 403 if logged in use has role Employee or Project", async () => {
    await request(app)
    .post(url)
    .send(mockData.validRequest)
    .set("Cookie", global.signin(Roles.Employee))
    .expect(403);

    await request(app)
    .post(url)
    .send(mockData.validRequest)
    .set("Cookie", global.signin(Roles.Employee))
    .expect(403);
  });

  it("Returns 400 if employee account creation wasn't successful by rabbitmq message processing", async () => {
    await request(app)
    .post(url)
    .send(mockData.validRequest)
    .set("Cookie", global.signin(Roles.Organization))
    .expect(400);
  });
});
