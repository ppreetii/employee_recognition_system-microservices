import mongoose from "mongoose";

//interface describing properties needed to create record
export interface EmpWeekAttrs {
  startDay: string;
  endDay: string;
  id: string | null;
  name: string | null;
  email: string | null;
  designation: string | null;
}

//interface describing properties that a mongo document has, one that is returned by Mongo
export interface EmpWeekDoc extends mongoose.Document {
  startDay: string;
  endDay: string;
  empId: string | null;
  name: string | null;
  email: string | null;
  designation: string | null;
}

//interface describing properties of Model
export interface EmpWeekModel extends mongoose.Model<EmpWeekDoc> {
  build(attrs: EmpWeekAttrs): EmpWeekDoc;
}
