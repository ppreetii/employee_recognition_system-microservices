import mongoose from "mongoose";

//interface describing properties needed to create record
export interface EmpDayAttrs {
  date: string;
  id: string | null;
  name: string | null;
  email: string | null;
  designation: string | null;
}

//interface describing properties that a mongo document has, one that is returned by Mongo
export interface EmpDayDoc extends mongoose.Document {
  date: string;
  empId: string | null;
  name: string | null;
  email: string | null;
  designation: string | null;
}

//interface describing properties of Model
export interface EmpDayModel extends mongoose.Model<EmpDayDoc> {
  build(attrs: EmpDayAttrs): EmpDayDoc;
}
