import { BadRequestError } from "@reward-sys/common";

import { Employee, EmployeeAttrs } from "../models/employee";

const createEmployee = async (data: EmployeeAttrs) => {
  try {
    const exists = await Employee.findOne({
      email: data.email,
    });
    if (exists) {
      throw new BadRequestError("Email already exists");
    }

    const employee = Employee.build({
      name: data.name,
      contact: data.contact,
      personal_email: data.personal_email,
      birthDate: data.birthDate,
      address: data.address,
      email: data.email,
      projectId: data.projectId,
      departmentId: data.departmentId,
      designation: data.designation,
    });

    await employee.save();

    return {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      designation: employee.designation,
      projectId: employee.projectId ?? null,
      departmentId: employee.departmentId ?? null,
    };
  } catch (error) {
    throw error;
  }
};

export default {
  createEmployee,
};
