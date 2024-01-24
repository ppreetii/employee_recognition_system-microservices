import request from "supertest";

import { app } from "../../../src/app";
import { API } from "../../../src/constants/api";
import { Roles, addDaysToDate, formatDateIST } from "@reward-sys/common";
import { createTask } from "../../utils/task";
import { createEmployee } from "../../utils/employee";
import mockData from "../../data/task";
import mockEmpData from "../../data/employee";
import employee from "../../data/employee";

const baseUrl = `${API.BASE_URL}${API.TASK}`;

describe(`Update A Task By Id SUCCESS Test cases: PUT ${baseUrl}${API.TASK_ID}`, () => {
  it("Return 200 with task info when Project role updates a task for a project s/he is managing", async () => {
    const managerData = await createEmployee(1, true);
    const task = await createTask({
      projectId: mockEmpData.projectId,
    });

    const res = await request(app)
      .put(`${baseUrl}/${task.id}`)
      .set("Cookie", global.signin(Roles.Project, managerData.id))
      .send(mockData.updateTaskBody)
      .expect(200);

    expect(res.body.id).toBe(task.id);
    expect(res.body.projectId).toBe(mockEmpData.projectId);
    expect(res.body.employeeId).toBe(task.employeeId);
  });

  it("Return 200 with task info when Employee role gets his/her own task", async () => {
    const empData = await createEmployee();
    const task = await createTask({
      employeeId: empData.id,
    });

    const res = await request(app)
      .put(`${baseUrl}/${task.id}`)
      .set("Cookie", global.signin(Roles.Employee, empData.id))
      .send(mockData.updateTaskBody)
      .expect(200);

    expect(res.body.id).toBe(task.id);
    expect(res.body.employeeId).toBe(empData.id);
  });
});

describe(`Update Task VALIDATION Test cases: PUT ${baseUrl}${API.TASK_ID}`, () => {
  it("Returns 400 for invalid request body", async () => {
    return request(app)
      .put(`${baseUrl}${API.TASK_ID}`)
      .send(mockData.invalidUpdateTask)
      .set("Cookie", global.signin(Roles.Employee))
      .expect(400);
  });

  it("Returns 400 if task has deadline but no assignee", async () => {
    const reqBody = {
      ...mockData.updateTaskBody,
      deadline: formatDateIST(new Date()),
    };

    return request(app)
      .put(`${baseUrl}${API.TASK_ID}`)
      .send(reqBody)
      .set("Cookie", global.signin(Roles.Employee))
      .expect(400);
  });

  it("Returns 400 if deadline date is less than today's date", async () => {
    const reqBody = {
      ...mockData.updateTaskBody,
      deadline: addDaysToDate(new Date(), -3),
      employeeId : mockData.id
    };

    return request(app)
      .put(`${baseUrl}${API.TASK_ID}`)
      .send(reqBody)
      .set("Cookie", global.signin(Roles.Employee))
      .expect(400);
  });

  it("Returns 400 if employeeId is invalid mongoID", async () => {
    const reqBody = {
        ...mockData.updateTaskBody,
        employeeId: "12345"
    };
   
    return request(app)
      .put(`${baseUrl}${API.TASK_ID}`)
      .send(reqBody)
      .set("Cookie", global.signin(Roles.Project))
      .expect(400);
  });

  it("Returns 400 for empty request body", async () => {
    return request(app)
      .put(`${baseUrl}${API.TASK_ID}`)
      .send({})
      .set("Cookie", global.signin(Roles.Project))
      .expect(400);
  });
});

describe(`Update A Task By Id FAILURE Test cases: GET ${baseUrl}${API.TASK_ID}`, () => {
  it("Returns 403 for Organization Role", async () => {
    return request(app)
      .put(`${baseUrl}/1`)
      .set("Cookie", global.signin(Roles.Organization))
      .send(mockData.updateTaskBody)
      .expect(403);
  });

  it("Returns 401 if not logged in", async () => {
    return request(app).put(`${baseUrl}/1`).send(mockData.updateTaskBody).expect(401);
  });

  it("Returns 404 if task doesnot exist", async () => {
    return request(app)
      .put(`${baseUrl}/1`)
      .set("Cookie", global.signin(Roles.Project))
      .send(mockData.updateTaskBody)
      .expect(404);
  });

  it("Returns 403 if a manager tries to update task info of another manager's project", async () => {
    const manager2 = await createEmployee(1, true, true);

    const task = await createTask({
      projectId: mockEmpData.projectId, //manager 1 project
    });

    return request(app)
      .put(`${baseUrl}/${task.id}`)
      .set("Cookie", global.signin(Roles.Project, manager2.id)) //manager2 has loggedIn but accessing manager1 task
      .send(mockData.updateTaskBody)
      .expect(403);
  });

  it("Returns 404 if a manager of the project to which task belongs, is not found", async () => {
    const task = await createTask();

    return request(app)
      .put(`${baseUrl}/${task.id}`)
      .set("Cookie", global.signin(Roles.Project, mockEmpData.managerData.id))
      .send(mockData.updateTaskBody)
      .expect(404);
  });
});

