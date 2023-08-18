import { BadRequestError } from "@reward-sys/common";

import { Employee, EmployeeAttrs } from "../models/employee";

const createEmployee = async (data: EmployeeAttrs) => {
  try {
    const employee = await Employee.findOne({
      email: data.email,
    });
    if (!employee) {
      throw new BadRequestError("Please Create Employee Account First");
    }

    employee.name = data.name;
    employee.contact = data.contact;
    employee.personal_email = data.personal_email;
    employee.birthDate = data.birthDate;
    employee.address = data.address;

    employee.projectId = data.projectId!;
    employee.departmentId = data.departmentId!;
    employee.designation = data.designation;

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
