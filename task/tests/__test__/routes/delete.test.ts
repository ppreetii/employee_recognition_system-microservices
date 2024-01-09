import request from "supertest";

import { app } from "../../../src/app";
import { API } from "../../../src/constants/api";
import { Roles } from "@reward-sys/common";
import { createTask, getTask } from "../../utils/task";
import { createEmployee } from "../../utils/employee";
import mockEmpData from "../../data/employee";

const baseUrl = `${API.BASE_URL}${API.TASK}`;

describe(`Delete A Task By Id SUCCESS Test cases: DELETE ${baseUrl}${API.TASK_ID}`, () => {
  it("Return 204 when Project role deletes a task for a project s/he is managing", async () => {
    const manager = await createEmployee(1, true);
    const task = await createTask({
      projectId: mockEmpData.projectId
    });

    await request(app)
      .delete(`${baseUrl}/${task.id}`)
      .set("Cookie", global.signin(Roles.Project, manager.id))
      .expect(204);

    const removedTask = await getTask(task.id);
    expect(removedTask).toBe(null);
  });

  it("Return 204 when Employee role deletes his/her own task", async () => {
    const employee = await createEmployee();
    const task = await createTask({
      employeeId: employee.id
    });

    await request(app)
      .delete(`${baseUrl}/${task.id}`)
      .set("Cookie", global.signin(Roles.Employee, employee.id))
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
    const manager2 = await createEmployee(1, false, true);
    const task = await createTask(); //task created with different manager

    const  res = await request(app)
      .delete(`${baseUrl}/${task.id}`)
      .set("Cookie", global.signin(Roles.Project, manager2.id))
      .expect(403);
      
  });
});
