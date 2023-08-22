import { BadRequestError, ForbiddenError, NotFoundError, Roles } from "@reward-sys/common";

import { Employee, EmployeeAttrs } from "../models/employee";
import { COMMON } from "../constants/common";

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

const getEmployees = async(page: number = 1) =>{
  try {
    const count = await Employee.find().countDocuments();
    const employees = await Employee.find().skip((page-1) * COMMON.EMPS_PER_PAGE).limit(COMMON.EMPS_PER_PAGE);
    const lastPage = Math.ceil(count / COMMON.EMPS_PER_PAGE);

    //TODO: Implement cache for Product and Name to populate product and department after Creating Product and Department Services
    return {
      currentPage: page,
      nextPage: page + 1 <= lastPage ? page + 1 : lastPage,
      previousPage: page - 1 >= 1 ? page - 1 : 1,
      lastPage,
      data: employees
    };
   
  } catch (error) {
    throw error;
  }
}

const getEmployeeById = async(empId: string, role:string, loginId:string) =>{
  try {
    if(role === Roles.Employee && empId !== loginId){
      throw new ForbiddenError();
    }

    const employee = await Employee.findById(empId);
    if(!employee){
      throw new NotFoundError()
    }

    if(role === Roles.Project){
      const currentUser = await Employee.findById(loginId);
      if(currentUser?.projectId !== employee.projectId){
         throw new ForbiddenError();
      }
    }

    return employee;
    
  } catch (error) {
    throw error;
  }
}

export default {
  createEmployee,
  getEmployees,
  getEmployeeById
};
