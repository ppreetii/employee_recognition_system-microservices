import mongoose from "mongoose";

import { EmpDayAttrs, EmpDayDoc, EmpDayModel} from "../types/emp-of-day";

const empOfDaySchema = new mongoose.Schema(
  {
    date: {
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

empOfDaySchema.statics.build = (attrs: EmpDayAttrs) => {
  return new EmpOfDay(attrs);
};

const EmpOfDay = mongoose.model<EmpDayDoc, EmpDayModel>(
  "emp_Of_day",
  empOfDaySchema
);

export { EmpOfDay };
