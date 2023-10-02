import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../../src/app";
import { API } from "../../../src/constants/api";
import mockData from "../../data/project";
import { Roles } from "@reward-sys/common";
import { createEmployee, createProject } from "../../utils/project";

const url = `${API.BASE_URL}${API.PROJECT}`;

describe(`Get All Projects SUCCESS Test cases: GET ${url}`, () => {
  it("Returns 200 for success case for Organization role", async () => {
    const { id } = await createProject();
    const res = await request(app)
      .get(url)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(200);

    expect(res.body.data).toBeDefined();
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].name).toBe(mockData.validRequest.name);
    expect(res.body.data[0].id).toBe(id);
  });

  it("Returns 200 for success case for Project role, and returns only project role's assigned project", async () => {
    const employee = await createEmployee();
    const { id } = await createProject(employee.id);
    const res = await request(app)
      .get(url)
      .set("Cookie", global.signin(Roles.Project, employee.id))
      .expect(200);

    expect(res.body.data).toBeDefined();
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].name).toBe(mockData.validRequest.name);
    expect(res.body.data[0].id).toBe(id);
    expect(res.body.data[0].manager.name).toBe(employee.name);
  });
});

describe(`Get All Projects FAILURE Test cases: GET ${url}`, () => {
  it("Returns 401 if not logged in", async () => {
    return request(app).get(url).expect(401);
  });

  it("Returns 403 if logged in use has role Employee", async () => {
    await request(app)
      .get(url)
      .set("Cookie", global.signin(Roles.Employee))
      .expect(403);
  });
});
