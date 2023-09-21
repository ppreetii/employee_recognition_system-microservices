import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../../src/app";
import { API } from "../../../src/constants/api";
import mockData from "../../data/project";
import { Roles } from "@reward-sys/common";
import { createProject } from "../../utils/project";

const url = `${API.BASE_URL}${API.PROJECT}`;

describe(`Get A Project SUCCESS Test cases: GET ${url}/:pid`, () => {
  it("Returns 200 for success case for Organization role", async () => {
    const { id } = await createProject();
    const res = await request(app)
      .get(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.name).toBe(mockData.validRequest.name);
    expect(res.body.id).toBe(id);
  });
});

describe(`Get A Project FAILURE Test cases: GET ${url}/:pid`, () => {
  it("Returns 401 if not logged in", async () => {
    return request(app).get(url).expect(401);
  });

  it("Returns 403 if logged in use has role Employee or Project", async () => {
    await request(app)
      .get(`${url}/${mockData.id}`)
      .set("Cookie", global.signin(Roles.Employee))
      .expect(403);

    await request(app)
      .get(`${url}/${mockData.id}`)
      .set("Cookie", global.signin(Roles.Project))
      .expect(403);
  });

  it("Return 404 if project doesnot exist", async () =>{
    return request(app)
      .get(`${url}/${mockData.id}`)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(404);
  })
});
