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

describe(`Get A Task By Id SUCCESS Test cases: GET ${baseUrl}${API.TASK_ID}`, () => {
  it("Return 200 with task info when Project role gets a task for a project s/he is managing", async () => {
    const task = await createTask({
      projectId: mockEmpData.projectId,
    });
    const mockAxios = new MockAdapter(axios);
    mockAxios
      .onGet(`${config.employeeURL!}/${mockEmpData.managerData.id}`)
      .reply(200, mockEmpData.managerData);

    const res = await request(app)
      .get(`${baseUrl}/${task.id}`)
      .set("Cookie", global.signin(Roles.Project, mockEmpData.managerData.id))
      .expect(200);

    expect(mockAxios.history.get[0].url).toEqual(
      `${config.employeeURL!}/${mockEmpData.managerData.id}`
    );

    expect(res.body.id).toBe(task.id);
    expect(res.body.projectId).toBe(mockEmpData.projectId);

    mockAxios.restore();
  });

  it("Return 200 with task info when Employee role gets his/her own task", async () => {
    const employeeId = mockData.id;
    const task = await createTask({
      employeeId,
    });

    const res = await request(app)
      .get(`${baseUrl}/${task.id}`)
      .set("Cookie", global.signin(Roles.Employee, employeeId))
      .expect(200);

    expect(res.body.id).toBe(task.id);
    expect(res.body.employeeId).toBe(employeeId);
  });
});

describe(`Get A Task By Id FAILURE Test cases: GET ${baseUrl}${API.TASK_ID}`, () => {
  it("Returns 403 for Organization Role", async () => {
    return request(app)
      .get(`${baseUrl}/1`)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(403);
  });

  it("Returns 401 if not logged in", async () => {
    return request(app).get(`${baseUrl}/1`).expect(401);
  });

  it("Returns 404 if task doesnot exist", async () => {
    return request(app)
      .get(`${baseUrl}/1`)
      .set("Cookie", global.signin(Roles.Project))
      .expect(404);
  });

  it("Returns 403 if a manager tries to access task info of another manager's project", async () => {
    const task = await createTask();

    const mockAxios = new MockAdapter(axios);
    mockAxios
      .onGet(`${config.employeeURL!}/${mockEmpData.managerData.id}`)
      .reply(200, mockEmpData.managerData);

    await request(app)
      .get(`${baseUrl}/${task.id}`)
      .set("Cookie", global.signin(Roles.Project, mockEmpData.managerData.id))
      .expect(403);

    mockAxios.restore();
  });
  
  //TODO: Check this scenerio again
  xit("Returns 400 if a manager of the project of which task is retrieved, is not found", async () => {
    const task = await createTask();

    const mockAxios = new MockAdapter(axios);
    mockAxios
      .onGet(`${config.employeeURL!}/${mockEmpData.managerData.id}`)
      .reply(400, {message: 'manager not found'});

    await request(app)
      .get(`${baseUrl}/${task.id}`)
      .set("Cookie", global.signin(Roles.Project, mockEmpData.managerData.id))
      .expect(400);

    mockAxios.restore();
  });
  
});
