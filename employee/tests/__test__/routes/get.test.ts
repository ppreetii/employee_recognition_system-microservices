import request from "supertest";

import { app } from "../../../src/app";
import { API } from "../../../src/constants/api";
import mockData from "../../data/employee";
import { Roles } from "@reward-sys/common";
import { createEmployee } from "../../utils/employee";

const url = `${API.BASE_URL}${API.EMPLOYEE}`;

describe(`Get An Employee By Id SUCCESS Test cases: GET ${url}${API.EMP_ID}`, () => {
  it("Returns 200 for any existing employee information requested by Organization role", async () => {
    const {id} = await createEmployee();
    const res = await request(app)
      .get(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.email).toBe(mockData.validRequest.email);
    expect(res.body.id).toBe(id);
  });

  it("Returns 200 for own information requested by Employee role", async () => {
    const {id} = await createEmployee();
    const res = await request(app)
      .get(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Employee, id))
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.email).toBe(mockData.validRequest.email);
    expect(res.body.id).toBe(id);
  });

  it("Returns 200 for own information requested by Project role", async () => {
    const {id} = await createEmployee();
    const res = await request(app)
      .get(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Project, id))
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.email).toBe(mockData.validRequest.email);
    expect(res.body.id).toBe(id);
  });

  it("Returns 200 for own information requested by Organization role", async () => {
    const {id} = await createEmployee();
    const res = await request(app)
      .get(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Organization, id))
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.email).toBe(mockData.validRequest.email);
    expect(res.body.id).toBe(id);
  });
});

describe(`Get An Employee By Id Employee FAILURE Test cases: POST ${url}${API.EMP_ID}`, () => {
  it("Returns 401 if not logged in", async () => {
    return request(app).get(`${url}/${mockData.id}`).expect(401);
  });

  it("Returns 404 if employee doesnot exist", async () => {
    await request(app)
      .get(`${url}/${mockData.id}`)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(404);
  });

  it("Returns 403 if loggedin user has employee role but the requested info is for another employee", async () => {
    const {id : loginId} = await createEmployee();
    await request(app)
      .get(`${url}/${mockData.id}`)
      .set("Cookie", global.signin(Roles.Employee,loginId))
      .expect(403);
  });

  it("Returns 403 if loggedin user has project but the requested info is for employee belonging to different project", async () => {
    const {id : projectlEmpId}= await createEmployee(true);
    const {id: searchEmpID}= await createEmployee();
    await request(app)
      .get(`${url}/${searchEmpID}`)
      .set("Cookie", global.signin(Roles.Project,projectlEmpId))
      .expect(403);
  });
});
