import request from "supertest";

import { app } from "../../../src/app";
import { API } from "../../../src/constants/api";
import mockData from "../../data/task";
import { Roles } from "@reward-sys/common";

const url = `${API.BASE_URL}${API.TASK}`;

describe(`Create Task SUCCESS Test cases: POST ${url}`, () => {
  it("Return 201 when task is created successfully by Project role", async () => {
    return request(app)
      .post(url)
      .send(mockData.validReq)
      .set("Cookie", global.signin(Roles.Project))
      .expect(201);
  });

  it("Return 201 when task is created successfully by Employee role", async () => {
    return request(app)
      .post(url)
      .send(mockData.validReq)
      .set("Cookie", global.signin(Roles.Employee))
      .expect(201);
  });

  it("Returns 201 if task has no deadline but assignee", async () => {
    const { deadline, ...rest } = mockData.validReq;
    return request(app)
      .post(url)
      .send(rest)
      .set("Cookie", global.signin(Roles.Employee))
      .expect(201);
  });
});

xdescribe(`Create Task VALIDATION Test cases: POST ${url}`, () => {
  it("Returns 400 for invalid request body", async () => {
    return request(app)
      .post(url)
      .send(mockData.invalidReq)
      .set("Cookie", global.signin(Roles.Employee))
      .expect(400);
  });

  it("Returns 400 if task has deadline but no assignee", async () => {
    const { employeeId, ...rest } = mockData.validReq;
    return request(app)
      .post(url)
      .send(rest)
      .set("Cookie", global.signin(Roles.Employee))
      .expect(400);
  });

  it("Returns 400 if employeeId is invalid mongoID", async () => {
    const reqBody = mockData.validReq;
    reqBody.employeeId = "12345"
    return request(app)
      .post(url)
      .send(reqBody)
      .set("Cookie", global.signin(Roles.Employee))
      .expect(400);
  });
  
  it("Returns 400 for empty request body", async () => {
    return request(app)
      .post(url)
      .send()
      .set("Cookie", global.signin(Roles.Project))
      .expect(400);
  });
});

xdescribe(`Create Task FAILURE Test cases: POST ${url}`, () => {
  it("Returns 403 for Organization Role", async ()=>{
    return request(app)
    .post(url)
    .send(mockData.invalidReq)
    .set("Cookie", global.signin(Roles.Organization))
    .expect(403);
  });
});
