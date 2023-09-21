import request from "supertest";

import { app } from "../../../src/app";
import { API } from "../../../src/constants/api";
import mockData from "../../data/employee";
import { Roles } from "@reward-sys/common";
import { createAccount } from "../../utils/employee";

const url = `${API.BASE_URL}${API.EMPLOYEE}`;

describe(`Get All Employee SUCCESS Test cases: GET ${url}`, () => {
  it("Returns 200 for success case", async () => {
    const id = await createAccount(mockData.validRequest.email);
    const res = await request(app)
      .get(url)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(200);
    
      expect(res.body.data).toBeDefined();
      expect(res.body.data[0].email).toBe(mockData.validRequest.email);
      expect(res.body.data[0].id).toBe(id);
  });
});

describe(`Get All Employees FAILURE Test cases: GET ${url}`, () => {
  it("Returns 401 if not logged in", async () => {
    return request(app)
    .get(url)
    .expect(401);
  });

  it("Returns 403 if logged in use has role Employee or Project", async () => {
    await request(app)
    .get(url)
    .set("Cookie", global.signin(Roles.Employee))
    .expect(403);

    await request(app)
    .get(url)
    .set("Cookie", global.signin(Roles.Project))
    .expect(403);
  });
});
