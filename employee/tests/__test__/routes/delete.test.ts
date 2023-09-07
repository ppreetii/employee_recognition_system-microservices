import request from "supertest";

import { app } from "../../../src/app";
import { API } from "../../../src/constants/api";
import mockData from "../../data/employee";
import { Roles } from "@reward-sys/common";
import { createEmployee } from "../../utils/employee";
import { DeleteEmployeePublisher } from "../../../src/events/publishers/delete-employee-publisher";

const url = `${API.BASE_URL}${API.EMPLOYEE}`;

describe(`Delete An Employee By Id SUCCESS Test cases: DELETE ${url}${API.EMP_ID}`, () => {
  it("Returns 204 for deleting an employee by Organization role", async () => {
    const {id} = await createEmployee();
    
    await request(app)
      .delete(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(204);

    const {body} = await request(app)
      .get(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Employee, id))
      .expect(200);
    expect(body.is_active).toBe(0);
  });

  it("Publishes Event when employee is deleted", async () => {
    const publishSpy = jest.spyOn(DeleteEmployeePublisher.prototype, "publish");
    const {id} = await createEmployee();
    
    await request(app)
      .delete(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(204);
    
    expect(publishSpy).toHaveBeenCalled();

    publishSpy.mockReset(); 
    publishSpy.mockRestore();
  });

  it("No Event is published when employee is already deleted", async () => {
    const publishSpy = jest.spyOn(DeleteEmployeePublisher.prototype, "publish");
    const {id} = await createEmployee(false, 0); //deleted employee created
    
    await request(app)
      .delete(`${url}/${id}`)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(204);
    
    expect(publishSpy).not.toHaveBeenCalled();

    publishSpy.mockReset(); 
    publishSpy.mockRestore();
  });
});

describe(`Delete An Employee By Id Employee FAILURE Test cases: DELETE ${url}${API.EMP_ID}`, () => {
  it("Returns 401 if not logged in", async () => {
    return request(app)
      .delete(`${url}/${mockData.id}`)
      .expect(401);
  });

  it("Returns 404 if employee doesnot exist", async () => {
    return request(app)
      .delete(`${url}/${mockData.id}`)
      .set("Cookie", global.signin(Roles.Organization))
      .expect(404);
  });

  it("Returns 403 if loggedin user has Employee role", async () => {
    return request(app)
      .delete(`${url}/${mockData.id}`)
      .set("Cookie", global.signin(Roles.Employee))
      .expect(403);
  });

  it("Returns 403 if loggedin user has Project role", async () => {
    return request(app)
      .delete(`${url}/${mockData.id}`)
      .set("Cookie", global.signin(Roles.Project))
      .expect(403);
  });
});
