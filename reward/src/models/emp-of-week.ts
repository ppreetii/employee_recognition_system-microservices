import mongoose from "mongoose";

import { EmpWeekAttrs, EmpWeekDoc, EmpWeekModel} from "../types/emp-of-week";

const empOfWeekSchema = new mongoose.Schema(
  {
    startDay: {
      type: String,
    },
    endDay: {
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

empOfWeekSchema.statics.build = (attrs: EmpWeekAttrs) => {
  return new EmpOfWeek(attrs);
};

const EmpOfWeek = mongoose.model<EmpWeekDoc, EmpWeekModel>(
  "emp_Of_week",
  empOfWeekSchema
);

export { EmpOfWeek };
