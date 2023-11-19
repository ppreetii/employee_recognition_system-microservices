import request from "supertest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { app } from "../../../src/app";
import { API } from "../../../src/constants/api";
import { Roles } from "@reward-sys/common";
import { createTask } from "../../utils/task";
import mockEmpData from "../../data/employee";
import mockData from "../../data/task";
import config from "../../../src/configs/config";

const baseUrl = `${API.BASE_URL}${API.TASK}`;

describe(`Get All Tasks SUCCESS Test cases: GET ${baseUrl}`, () => {
  it("Return 200 with task list when Project role gets all tasks for all projects s/he is managing", async () => {
    const task = await createTask({
      projectId: mockEmpData.projectId,
    });
    const mockAxios = new MockAdapter(axios);
    mockAxios
      .onGet(`${config.employeeURL!}/${mockEmpData.managerData.id}`)
      .reply(200, mockEmpData.managerData);

    const res = await request(app)
      .get(baseUrl)
      .set("Cookie", global.signin(Roles.Project, mockEmpData.managerData.id))
      .expect(200);

    expect(mockAxios.history.get[0].url).toEqual(
      `${config.employeeURL!}/${mockEmpData.managerData.id}`
    );
    expect(res.body.totalRecords).toBe(1);
    expect(res.body.data[0].id).toBe(task.id);
    expect(res.body.data[0].projectId).toBe(mockEmpData.projectId);

    mockAxios.reset();
  });
  
  it("Return 200 with task list of an employee", async () => {
    const employeeId = mockData.id;
    const task = await createTask({
      employeeId,
    });

    const res = await request(app)
      .get(baseUrl)
      .set("Cookie", global.signin(Roles.Employee, employeeId))
      .expect(200);

    expect(res.body.totalRecords).toBe(1);
    expect(res.body.data[0].id).toBe(task.id);
    expect(res.body.data[0].employeeId).toBe(employeeId);
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
