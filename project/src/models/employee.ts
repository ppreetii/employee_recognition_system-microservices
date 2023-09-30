import mongoose from "mongoose";

import { EmployeeAttrs, EmployeeDoc, EmployeeModel } from "../types/employee";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
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

employeeSchema.statics.build = (attrs: EmployeeAttrs) => {
  return new Employee(attrs);
};

const Employee = mongoose.model<EmployeeDoc, EmployeeModel>(
  "employee",
  employeeSchema
);

export { Employee };
