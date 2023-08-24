import mongoose from "mongoose";

import { AccountAttrs , EmployeeDoc, EmployeeModel} from "../types/employee";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    contact: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    personal_email: {
      type: String,
    },
    birthDate: {
      type: String,
    },
    address: {
      type: String,
    },
    projectId: {
      type: String,
    },
    departmentId: {
      type: String,
    },
    designation: {
      type: String,
    },
    employee_of_the_day: {
      type: Number,
      default: 0,
    },
    employee_of_the_week: {
      type: Number,
      default:0
    },
    employee_of_the_month: {
      type: Number,
      default: 0
    },
    bonusStars: {
      type: Number,
      default: 10,
    },
    is_active: {
      type: Number,
      default: 1,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

employeeSchema.statics.build = (attrs: AccountAttrs) => {
  return new Employee(attrs);
};

const Employee = mongoose.model<EmployeeDoc, EmployeeModel>(
  "Employee",
  employeeSchema
);

export { Employee };
