import request from "supertest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { app } from "../../../src/app";
import { API } from "../../../src/constants/api";
import { Roles } from "@reward-sys/common";
import { createTask, getTask } from "../../utils/task";
import mockEmpData from "../../data/employee";
import mockData from "../../data/task";
import config from "../../../src/configs/config";

const baseUrl = `${API.BASE_URL}${API.TASK}`;

describe(`Delete A Task By Id SUCCESS Test cases: DELETE ${baseUrl}${API.TASK_ID}`, () => {
  it("Return 204 when Project role deletes a task for a project s/he is managing", async () => {
    const task = await createTask({
      projectId: mockEmpData.projectId,
    });
    const mockAxios = new MockAdapter(axios);
    mockAxios
      .onGet(`${config.employeeURL!}/${mockEmpData.managerData.id}`)
      .reply(200, mockEmpData.managerData);

    await request(app)
      .delete(`${baseUrl}/${task.id}`)
      .set("Cookie", global.signin(Roles.Project, mockEmpData.managerData.id))
      .expect(204);

    expect(mockAxios.history.get[0].url).toEqual(
      `${config.employeeURL!}/${mockEmpData.managerData.id}`
    );

    mockAxios.reset();

    const removedTask = await getTask(task.id);
    expect(removedTask).toBe(null);
  });

  it("Return 204 when Employee role deletes his/her own task", async () => {
    const employeeId = mockData.id;
    const task = await createTask({
      employeeId,
    });

    await request(app)
      .delete(`${baseUrl}/${task.id}`)
      .set("Cookie", global.signin(Roles.Employee, employeeId))
      .expect(204);

    const removedTask = await getTask(task.id);
    expect(removedTask).toBe(null);
  });
});

describe(`Delete A Task By Id FAILURE Test cases: DELETE ${baseUrl}${API.TASK_ID}`, () => {
  it("Returns 403 for Organization Role", async () => {
    return request(app)
      .delete(`${baseUrl}/1`)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(403);
  });

  it("Returns 401 if not logged in", async () => {
    return request(app).delete(`${baseUrl}/1`).expect(401);
  });

  it("Returns 404 if task doesnot exist", async () => {
    return request(app)
      .get(`${baseUrl}/1`)
      .set("Cookie", global.signin(Roles.Project))
      .expect(404);
  });

  it("Returns 403 if a manager tries to delete task of another manager's project", async () => {
    const task = await createTask(); //task created with different manager

    const mockAxios = new MockAdapter(axios);
    mockAxios
      .onGet(`${config.employeeURL!}/${mockEmpData.managerData.id}`)
      .reply(200, mockEmpData.managerData);

    await request(app)
      .delete(`${baseUrl}/${task.id}`)
      .set("Cookie", global.signin(Roles.Project, mockEmpData.managerData.id))
      .expect(403);

    expect(mockAxios.history.get[0].url).toEqual(
      `${config.employeeURL!}/${mockEmpData.managerData.id}`
    );
    mockAxios.restore();
  });
});
