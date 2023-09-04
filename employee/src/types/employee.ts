import mongoose from "mongoose";

//interface describing properties needed to create an employee by rabbitmq
export interface AccountAttrs {
  id: mongoose.Types.ObjectId;
  email: string;
}

//interface describing properties of Employee Model
export interface EmployeeModel extends mongoose.Model<EmployeeDoc> {
  build(attrs: AccountAttrs | EmployeeAttrs): EmployeeDoc;
}

//interface describing properties that a Employee document has, one that is returned by Mongo
export interface EmployeeDoc extends mongoose.Document {
  name: string;
  contact: string;
  personal_email: string;
  birthDate: string;
  address: string;
  email: string;
  projectId: string;
  departmentId: string;
  designation: string;
  employee_of_the_day: Number;
  employee_of_the_week: Number;
  employee_of_the_month: Number;
  bonusStars: Number;
  is_active : Number;
}

//interface describing properties needed to create an employee by post request
export interface EmployeeAttrs {
  name: string;
  contact: string;
  personal_email: string;
  birthDate: string;
  address: string;
  email: string;
  projectId?: string;
  departmentId?: string;
  designation: string;
}

//interface describing properties needed to update an employee by patch request
export interface UpdateEmployeeAttrs {
  contact?: string;
  personal_email?: string;
  address?: string;
  projectId?: string;
  departmentId?: string;
  designation: string;
}

