import mongoose from "mongoose";

//interface describing properties needed to create an employee
export interface AccountAttrs{
  id: mongoose.Types.ObjectId;
  email: string;
}

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

//interface describing properties of Employee Model
interface EmployeeModel extends mongoose.Model<EmployeeDoc> {
  build(attrs: AccountAttrs): EmployeeDoc;
}

//interface describing properties that a Employee document has, one that is returned by Mongo
interface EmployeeDoc extends mongoose.Document {
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
}

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
