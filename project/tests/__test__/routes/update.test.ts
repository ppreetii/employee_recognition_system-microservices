import request from "supertest";
import { app } from "../../../src/app";

import { API } from "../../../src/constants/api";
import mockData from "../../data/project";
import { createProject } from "../../utils/project";
import { Roles } from "@reward-sys/common";

const url = `${API.BASE_URL}${API.PROJECT}`;
describe(`Update Project SUCCESS test cases : PATCH ${url}/:pid`, () => {
  test("Return 200 upon successful update by Organization", async () => {
    const { id, manager_id } = await createProject();
    const { manager_id: updatedManager, members } = mockData.validUpdateReq;
    const res = await request(app)
      .patch(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Organization))
      .send({
        manager_id: updatedManager,
        members,
      })
      .expect(200);

    expect(res.body.id).toBe(id);
    expect(res.body.manager).toBe(updatedManager);
    expect(res.body.past_managers[0].toString()).toBe(manager_id.toString());
    expect(res.body.team_members).toHaveLength(0);
  });

  test("Return 200 upon successful update by Project", async () => {
    const { id, manager_id } = await createProject();
    const { manager_id: newManager, members } = mockData.validUpdateReq;
    const res = await request(app)
      .patch(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Project, manager_id))
      .send({
        manager_id: newManager,
        members,
      })
      .expect(200);

    expect(res.body.id).toBe(id);
    expect(res.body.manager.toString()).toBe(manager_id.toString());
    expect(res.body.past_managers).toHaveLength(0);
    expect(res.body.team_members).toHaveLength(2);
    expect(res.body.team_members[0]).toBe(members[0]);
    expect(res.body.team_members[1]).toBe(members[1]);
  });
});

describe(`Update Project VALIDATION test cases : PATCH ${url}/:pid`, () => {
  test("ReturnS 400 for invalid manager_id ", async () => {
    const { id } = await createProject();
    return request(app)
      .patch(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Organization))
      .send({
        manager_id: mockData.invalidUpdateReq.manager_id,
      })
      .expect(400);
  });
  test("ReturnS 400 for invalid memmbers list", async () => {
    const { id } = await createProject();
    return request(app)
      .patch(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Project))
      .send({
        members: mockData.invalidUpdateReq.members,
      })
      .expect(400);
  });
});

describe(`Update Project FAILURE test cases : PATCH ${url}/:pid`, () => {
  test("Return 401 if not loggedin", async () => {
    return request(app)
    .patch(`${url}/${mockData.id}`)
    .send(mockData.validUpdateReq)
    .expect(401);
  });
  test("Return 403 if logged in user has Employee role", async () => {
    return request(app)
      .patch(`${url}/${mockData.id}`)
      .set("Cookie", global.signin(Roles.Employee))
      .send(mockData.validUpdateReq)
      .expect(403);
  });
  test("Return 404 if project doesnot exist", async () => {
    return request(app)
    .patch(`${url}/${mockData.id}`)
    .set("Cookie", global.signin(Roles.Organization))
    .send(mockData.validUpdateReq)
    .expect(404);
  });
  test("Return 403 if loggedin project role user is trying to add members to a project not managed by him/her", async ()=>{
    const { id } = await createProject();
    return request(app)
    .patch(`${url}/${id}`)
    .set("Cookie", global.signin(Roles.Project))
    .send(mockData.validUpdateReq)
    .expect(403);
  })
});
