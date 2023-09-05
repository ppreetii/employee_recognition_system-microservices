import request from "supertest";

import { app } from "../../src/app";
import { API } from "../../src/constants/api";
import mockData from "../data/employee";
import { Roles } from "@reward-sys/common";
import { createEmployee } from "../utils/employee";

const url = `${API.BASE_URL}${API.EMPLOYEE}`;

describe(`Update An Employee By Id SUCCESS Test cases: PATCH ${url}${API.EMP_ID}`, () => {
  it("Returns 200 for updating personal information requested by Employee role", async () => {
    const {id, projectId, departmentId, designation} = await createEmployee();
    const reqBody = mockData.updateValidReq;

    const res = await request(app)
      .patch(`${url}/${id}`)
      .send(reqBody)
      .set("Cookie", global.signin(Roles.Employee, id))
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(id);
    expect(res.body.contact).toBe(mockData.updateValidReq.contact);
    expect(res.body.address).toBe(mockData.updateValidReq.address);
    expect(res.body.personal_email).toBe(mockData.updateValidReq.personal_email);

    //projectId, designation, department remains same although we update these information, this is expected for Employee role
    expect(res.body.projectId).toEqual(projectId);
    expect(res.body.departmentId).toEqual(departmentId);
    expect(res.body.designation).toEqual(designation);
  });

  it("Returns 200 for updating personal information requested by Project role", async () => {
    const {id, projectId, departmentId, designation} = await createEmployee();
    const reqBody = mockData.updateValidReq;

    const res = await request(app)
      .patch(`${url}/${id}`)
      .send(reqBody)
      .set("Cookie", global.signin(Roles.Project, id))
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(id);
    expect(res.body.contact).toBe(mockData.updateValidReq.contact);
    expect(res.body.address).toBe(mockData.updateValidReq.address);
    expect(res.body.personal_email).toBe(mockData.updateValidReq.personal_email);

    //projectId, designation, department remains same although we update these information, this is expected for Project role
    expect(res.body.projectId).toEqual(projectId);
    expect(res.body.departmentId).toEqual(departmentId);
    expect(res.body.designation).toEqual(designation);
  });

  it("Returns 200 for updating personal information requested by Organization role", async () => {
    const {id, projectId, departmentId, designation} = await createEmployee();
    const reqBody = mockData.updateValidReq;

    const res = await request(app)
      .patch(`${url}/${id}`)
      .send(reqBody)
      .set("Cookie", global.signin(Roles.Organization, id))
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(id);
    expect(res.body.contact).toBe(mockData.updateValidReq.contact);
    expect(res.body.address).toBe(mockData.updateValidReq.address);
    expect(res.body.personal_email).toBe(mockData.updateValidReq.personal_email);

    //projectId, designation, department remains same although we update these information, this is expected for Organization role for self inforamtion change
    expect(res.body.projectId).toEqual(projectId);
    expect(res.body.departmentId).toEqual(departmentId);
    expect(res.body.designation).toEqual(designation);
  });

  it("Returns 200 for updating designation, project and department of an employee by Organization role", async () => {
    const {id, projectId, departmentId, designation} = await createEmployee();
    const reqBody = mockData.updateValidReq;

    const res = await request(app)
      .patch(`${url}/${id}`)
      .send(reqBody)
      .set("Cookie", global.signin(Roles.Organization, mockData.id)) // organization has different id
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(id);
    expect(res.body.projectId).toEqual(reqBody.projectId);
    expect(res.body.projectId).not.toEqual(projectId);
    expect(res.body.designation).toEqual(reqBody.designation);
    expect(res.body.designation).not.toEqual(designation);
    expect(res.body.departmentId).toEqual(reqBody.departmentId);
    expect(res.body.departmentId).not.toEqual(departmentId);

    //all other info remains same although we request to update these information, this is expected for Organization role to change
    // only project,designation and department of other employee
    expect(res.body.contact).toBe(mockData.validRequest.contact);
    expect(res.body.address).toBe(mockData.validRequest.address);
    expect(res.body.personal_email).toBe(mockData.validRequest.personal_email);

  });

  it("Returns 200 WITHOUT updating designation, project and department if an employee with Organization role tries to update his/her designation, department and project", async () => {
    const {id, projectId, departmentId, designation} = await createEmployee();
    const reqBody = mockData.updateValidReq;

    const res = await request(app)
      .patch(`${url}/${id}`)
      .send(reqBody)
      .set("Cookie", global.signin(Roles.Organization, id)) // organization is using self account to update his/her own designation, project and department
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(id);
    expect(res.body.projectId).not.toEqual(reqBody.projectId);
    expect(res.body.projectId).toEqual(projectId);
    expect(res.body.designation).not.toEqual(reqBody.designation);
    expect(res.body.designation).toEqual(designation);
    expect(res.body.departmentId).not.toEqual(reqBody.departmentId);
    expect(res.body.departmentId).toEqual(departmentId);

    //all other info changes, this is expected for Organization role for changing self information 
    //like contact, address, personal_email
    expect(res.body.contact).toBe(mockData.updateValidReq.contact);
    expect(res.body.address).toBe(mockData.updateValidReq.address);
    expect(res.body.personal_email).toBe(mockData.updateValidReq.personal_email);

  });

});

describe(`Update An Employee By Id Employee FAILURE Test cases: PATCH ${url}${API.EMP_ID}`, () => {
  it("Returns 401 if not logged in", async () => {
    return request(app)
      .patch(`${url}/${mockData.id}`)
      .send(mockData.updateValidReq)
      .expect(401);
  });

  it("Returns 404 if employee doesnot exist", async () => {
    await request(app)
      .get(`${url}/${mockData.id}`)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(404);
  });

  it("Returns 403 if loggedin user has employee role but s/he is updating another employee", async () => {
    const {id : loginId} = await createEmployee();
    const reqBody = mockData.updateValidReq;
    await request(app)
      .patch(`${url}/${mockData.id}`) //different user
      .send(reqBody)
      .set("Cookie", global.signin(Roles.Employee, loginId))
      .expect(403)
  });

  it("Returns 403 if loggedin user has project role but s/he is updating another employee", async () => {
    const {id : loginId} = await createEmployee();
    const reqBody = mockData.updateValidReq;
    await request(app)
      .patch(`${url}/${mockData.id}`) //different user
      .send(reqBody)
      .set("Cookie", global.signin(Roles.Project, loginId))
      .expect(403)
  });

  it("Returns 404 if employee doesn't exist", async () => {
    const reqBody = mockData.updateValidReq;
    await request(app)
      .patch(`${url}/${mockData.id}`)
      .send(reqBody)
      .set("Cookie", global.signin(Roles.Project, mockData.id))
      .expect(404)
  });
});


describe(`Update Employee By Id VALIDATION Test cases: PATCH ${url}${API.EMP_ID}`, () => {
    it("Returns 400 for invalid request body", async () => {
        const {id : loginId} = await createEmployee();
        const reqBody = mockData.invalidUpdateReq;
        await request(app)
          .patch(`${url}/${loginId}`)
          .send(reqBody)
          .set("Cookie", global.signin(Roles.Employee, loginId))
          .expect(400)
    });
  });