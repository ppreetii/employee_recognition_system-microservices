import request from "supertest";

import { app } from "../../../src/app";
import { Roles } from "@reward-sys/common";
import { API } from "../../../src/constants/api";
import mockData from "../../data/project";
import { createEmployee } from "../../utils/project";

const url = `${API.BASE_URL}${API.PROJECT}`;

describe(`SUCCESS Test cases - Create Project: POST ${url}`, () => {
  it("Returns 201 for success project creation", async () => {
    const {name, client_id} = mockData.validRequest;
    const employee = await createEmployee();
    return request(app)
      .post(url)
      .send({
        name,
        client_id,
        manager_id: employee.id,
      })
      .set("Cookie", global.signin(Roles.Organization))
      .expect(201);
  });
});

describe(`VALIDATION Test cases - Create Project: POST ${url}`, () => {
  it("Returns 400 for invalid request body", async () => {
    return request(app)
      .post(url)
      .send(mockData.invalidRequest)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  });

  it("Returns 400 for missing name", async () => {
    const { name, ...rest } = mockData.validRequest;
    return request(app)
      .post(url)
      .send(rest)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  });

  it("Returns 400 for missing client_id ", async () => {
    const { client_id, ...rest } = mockData.validRequest;
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

  it("Returns 400 for no request body", async () => {
    return request(app)
      .post(url)
      .send()
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  });
});

describe(`FAILURE Test cases - Create Project: POST ${url}`, () => {
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

  it("Returns 400 if manager information is not present", async ()=>{
    return request(app)
    .post(url)
    .send(mockData.validRequest)
    .set("Cookie", global.signin(Roles.Organization))
    .expect(400);
  });

  it("Returns 400 if manager is no longer part of company", async ()=>{
    const {name, client_id} = mockData.validRequest;
    const employee = await createEmployee(0); //creating emp with inactive state
    return request(app)
      .post(url)
      .send({
        name,
        client_id,
        manager_id: employee.id,
      })
      .set("Cookie", global.signin(Roles.Organization))
      .expect(400);
  })
});
