import request from "supertest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { app } from "../../../src/app";
import { API } from "../../../src/constants/api";
import { Roles } from "@reward-sys/common";
import { createTask } from "../../utils/task";
import { createEmployee } from "../../utils/employee";
import mockEmpData from "../../data/employee";
import mockData from "../../data/task";
import config from "../../../src/configs/config";

const baseUrl = `${API.BASE_URL}${API.TASK}`;

describe(`Get All Tasks SUCCESS Test cases: GET ${baseUrl}`, () => {
  it("Return 200 with task list when Project role gets all tasks for all projects s/he is managing", async () => {
    const managerData = await createEmployee(1, true);
    const empData = await createEmployee();
    const task = await createTask({
      projectId: mockEmpData.projectId,
      employeeId: empData.id
    });

    const res = await request(app)
      .get(baseUrl)
      .set("Cookie", global.signin(Roles.Project, managerData.id))
      .expect(200);

    expect(res.body.totalRecords).toBe(1);
    expect(res.body.data[0].id).toBe(task.id);
    expect(res.body.data[0].projectId).toBe(mockEmpData.projectId);

  });
  
  it("Return 200 with task list of an employee", async () => {
    const empData = await createEmployee();
    const task = await createTask({
      employeeId: empData.id
    });

    const res = await request(app)
      .get(baseUrl)
      .set("Cookie", global.signin(Roles.Employee, empData.id))
      .expect(200);

    expect(res.body.totalRecords).toBe(1);
    expect(res.body.data[0].id).toBe(task.id);
    expect(res.body.data[0].employeeId).toBe(empData.id);
  });
});

describe(`Get All Task FAILURE Test cases: GET ${baseUrl}`, () => {
  it("Returns 403 for Organization Role", async () => {
    return request(app)
      .get(baseUrl)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(403);
  });
});
