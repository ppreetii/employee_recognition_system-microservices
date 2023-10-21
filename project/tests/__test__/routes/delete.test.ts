import request from "supertest";

import { app } from "../../../src/app";
import { API } from "../../../src/constants/api";
import mockData from "../../data/project";
import { Roles, formatDateIST } from "@reward-sys/common";
import { createEmployee, createProject } from "../../utils/project";

const url = `${API.BASE_URL}${API.PROJECT}`;

describe(`Delete A Project By Id SUCCESS Test cases: DELETE ${url}${API.PROJ_ID}`, () => {
  it("Returns 204 for deleting a project by Organization role", async () => {
    const {id} = await createProject();
    const employee = await createEmployee();
    await request(app)
      .delete(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Organization, employee.id))
      .expect(204);

    const {body} = await request(app)
      .get(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Organization, employee.id))
      .expect(200);
    expect(body.is_active).toBe(0);
    expect(body.closed_on).toBe(formatDateIST(new Date()));
    expect(body.closed_by).toBe(employee.id);
  });

});

describe(`Delete A Project By Id FAILURE Test cases: DELETE ${url}${API.PROJ_ID}`, () => {
  it("Returns 401 if not logged in", async () => {
    return request(app)
      .delete(`${url}/${mockData.id}`)
      .expect(401);
  });

  it("Returns 404 if project doesnot exist", async () => {

    return request(app)
      .delete(`${url}/${mockData.id}`)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(404);
  });

  it("Returns 403 if loggedin user has Employee role", async () => {
    return request(app)
      .delete(`${url}/${mockData.id}`)
      .set("Cookie", global.signin(Roles.Employee))
      .expect(403);
  });

  it("Returns 403 if loggedin user has Project role", async () => {
    return request(app)
      .delete(`${url}/${mockData.id}`)
      .set("Cookie", global.signin(Roles.Project))
      .expect(403);
  });
});
