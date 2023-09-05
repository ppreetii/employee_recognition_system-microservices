import mongoose from "mongoose";

import { Employee } from "../../src/models/employee";
import data from "../data/employee"

export const createAccount = async (email: string) => { //this is done by rabbitmq listener, but we have to do it manually for test cases
  const id = new mongoose.Types.ObjectId();

  const employee = Employee.build({
    id,
    email
  });

  await employee.save();

  return id.toHexString();
};

export const createEmployee = async (projectId = false) =>{
  const employee = Employee.build(data.validRequest);
  if(projectId){
    employee.projectId = new mongoose.Types.ObjectId().toHexString();
  }
  await employee.save();

  return {
    id: employee.id,
    projectId: employee.projectId,
    designation: employee.designation,
    departmentId: employee.departmentId
  }
}