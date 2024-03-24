import mongoose from "mongoose";

import { EmpMonthAttrs, EmpMonthDoc, EmpMonthModel} from "../types/emp-of-month";

const empOfMonthSchema = new mongoose.Schema(
  {
    month: {
      type: String,
    },
    year: {
      type: String,
    },
    empId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    designation: {
      type: String,     
    }
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

empOfMonthSchema.statics.build = (attrs: EmpMonthAttrs) => {
  return new EmpOfMonth(attrs);
};

const EmpOfMonth = mongoose.model<EmpMonthDoc, EmpMonthModel>(
  "emp_Of_month",
  empOfMonthSchema
);

export { EmpOfMonth };
