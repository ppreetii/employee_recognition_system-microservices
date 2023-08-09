import mongoose from "mongoose";

//interface describing properties needed to create an employee
interface EmployeeAttrs {
  id: string;
  name: string;
  contact: string;
  personal_email: string;
  birthDate: Date;
  address: string;
}

//interface describing properties of Employee Model
interface EmployeeModel extends mongoose.Model<EmployeeDoc> {
  build(attrs: EmployeeAttrs): EmployeeDoc;
}

//interface describing properties that a Employee document has, one that is returned by Mongo
interface EmployeeDoc extends mongoose.Document {
  name: string;
  contact: string;
  personal_email: string;
  birthDate: Date;
  address: string;
  empId: string;
  email: string;
  projectId: string;
  departmentId: string;
  designation: string;
  employee_of_the_day: Number;
  employee_of_the_week: Number;
  employee_of_the_month: Number;
  bonusStars: Number;
  is_approved: Number;
}

const employeeSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    personal_email: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
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
    },
    employee_of_the_week: {
      type: Number,
    },
    employee_of_the_month: {
      type: Number,
    },
    bonusStars: {
      type: Number,
    },
    is_active: {
      type: Number,
      default: 1,
    },
    is_approved: {
      type: Number,
      default: 0,
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
  "Employee",
  employeeSchema
);

export { Employee };
