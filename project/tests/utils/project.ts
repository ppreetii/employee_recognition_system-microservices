import mongoose from "mongoose";
import { Employee } from "../../src/models/employee";
import { Project } from "../../src/models/project";
import mockData from "../data/project";
import { formatDateIST } from "@reward-sys/common";

export const createProject = async (managerId?: string) => {
  // we have to do it manually for test cases
  const createdOn = formatDateIST(new Date());
  const { name, client_id, manager_id } = mockData.validRequest;
  const project = Project.build({
    name,
    client_id,
    manager_id: managerId ?? manager_id,
    created_on: createdOn,
  });
  await project.save();

  return {
    id: project.id,
    manager_id: project.manager_id,
  };
};

export const createEmployee = async (is_active?: number) => {
  const employee = Employee.build({
    id: new mongoose.Types.ObjectId(),
    email: "test@test.com",
    name: "test employee 1",
  });
  if (is_active === 0) {
    employee.is_active = 0;
  }

  await employee.save();

  return employee;
};
