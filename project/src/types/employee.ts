import mongoose from "mongoose";

//interface describing properties of Employee Model
export interface EmployeeModel extends mongoose.Model<EmployeeDoc> {
  build(attrs: EmployeeAttrs): EmployeeDoc;
}

//interface describing properties that a Employee document has, one that is returned by Mongo
export interface EmployeeDoc extends mongoose.Document {
  name: string;
  email: string;
  is_active: Number;
}

//interface describing properties needed to create an employee
export interface EmployeeAttrs {
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  is_active?: Number;
}
