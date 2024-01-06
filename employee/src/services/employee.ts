import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  Roles,
} from "@reward-sys/common";
import { rabbitmq, Queue } from "@reward-sys/rabbitmq";

import { Employee } from "../models/employee";
import {
  EmployeeAttrs,
  UpdateEmployeeAttrs,
  EmployeeDoc,
} from "../types/employee";
import { COMMON } from "../constants/common";
import { DeleteEmployeePublisher } from "../events/publishers/delete-employee-publisher";
import { NewEmployeePublisher } from "../events/publishers/new-employee-publisher";

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

    new NewEmployeePublisher(rabbitmq.client).publish(
      {
        email: employee.email,
        employeeId: employee.id,
        name: employee.name,
        designation: employee.designation,
        projectId: data.projectId
      },
      [Queue.Project, Queue.Task]
    );

    return sanitizeEmpData(employee, true);
  } catch (error) {
    throw error;
  }
};

const getEmployees = async (page: number = 1) => {
  try {
    const count = await Employee.find().countDocuments();
    const employees = await Employee.find()
      .skip((page - 1) * COMMON.EMPS_PER_PAGE)
      .limit(COMMON.EMPS_PER_PAGE);
    const lastPage = Math.ceil(count / COMMON.EMPS_PER_PAGE);
    const data = employees.map((emp) => sanitizeEmpData(emp));
    //TODO: Implement cache for Product and Name to populate product and department after Creating Product and Department Services
    return {
      total: count,
      currentPage: page,
      nextPage: page + 1 <= lastPage ? page + 1 : lastPage,
      previousPage: page - 1 >= 1 ? page - 1 : 1,
      lastPage,
      data,
    };
  } catch (error) {
    throw error;
  }
};

const getEmployeeById = async (
  empId: string,
  role?: string,
  loginId?: string
) => {
  try {
    if (role === Roles.Employee && empId !== loginId) {
      throw new ForbiddenError();
    }

    const employee = await Employee.findById(empId);
    if (!employee) {
      throw new NotFoundError("Employee Not Found");
    }

    if (role === Roles.Project) {
      const currentUser = await Employee.findById(loginId);
      let intersection = currentUser?.projectId.filter((proj) =>
        employee.projectId.includes(proj)
      );
      if (!intersection?.length) {
        throw new ForbiddenError();
      }
    }

    return sanitizeEmpData(employee, true);
  } catch (error) {
    throw error;
  }
};

const updateEmployee = async (
  empId: string,
  role: string,
  loginId: string,
  data: UpdateEmployeeAttrs
) => {
  try {
    if (empId !== loginId && role !== Roles.Organization) {
      throw new ForbiddenError();
    }

    const employee = await Employee.findById(empId);
    if (!employee) {
      throw new NotFoundError("Employee Not Found");
    }

    if (empId === loginId) {
      updateBySelf(employee, data);
    }

    if (role === Roles.Organization && empId !== loginId) {
      // an employee with organization role cannot update their own designation, department, and project,s/he can update it for other
      //employee only, not self
      updateByOrganization(employee, data);
    }

    await employee.save();

    return sanitizeEmpData(employee,true);
  } catch (error) {
    throw error;
  }
};

const deleteEmployee = async (empId: string, role: string) => {
  try {
    const employee = await Employee.findById(empId);

    if (!employee) {
      throw new NotFoundError("Employee Not Found");
    }

    if (employee.is_active === 0) {
      return;
    }

    employee.is_active = 0;
    await employee.save();

    new DeleteEmployeePublisher(rabbitmq.client).publish(
      {
        email: employee.email,
        employeeId: empId,
      },
      [Queue.Auth, Queue.Project]
    );
  } catch (error) {
    throw error;
  }
};

function updateBySelf(employee: EmployeeDoc, data: UpdateEmployeeAttrs) {
  if (data.contact) employee.contact = data.contact;
  if (data.personal_email) employee.personal_email = data.personal_email;
  if (data.address) employee.address = data.address;
}

function updateByOrganization(
  employee: EmployeeDoc,
  data: UpdateEmployeeAttrs
) {
  if (data.projectId) employee.projectId = data.projectId;
  if (data.departmentId) employee.departmentId = data.departmentId;
  if (data.designation) employee.designation = data.designation;
}

function sanitizeEmpData(record: EmployeeDoc, optional: boolean = false) {
  const data: any = {
    id: record.id,
    name: record.name,
    email: record.email,
    designation: record.designation,
    projectId: record.projectId ?? null,
    departmentId: record.departmentId ?? null,
    is_active: record.is_active,
  };

  if (optional) {
    data.bonusStars = record.bonusStars;
    data.address = record.address;
    data.birthDate = record.birthDate;
    data.contact = record.contact;
    data.personal_email = record.personal_email;
    data.employee_of_the_day = record.employee_of_the_day;
    data.employee_of_the_month = record.employee_of_the_month;
    data.employee_of_the_week = record.employee_of_the_week;
  }

  return data;
}

export default {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
