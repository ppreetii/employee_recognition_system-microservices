import mongoose from "mongoose";

//interface describing properties needed to create record
export interface EmpMonthAttrs {
    month: number;
    year: number;
    id: string | null;
    name: string | null;
    email: string | null;
    designation: string | null;
}

//interface describing properties that a mongo document has, one that is returned by Mongo
export interface EmpMonthDoc extends mongoose.Document {
    month: number;
    year: number;
    empId: string | null;
    name: string | null;
    email: string | null;
    designation: string | null;
}

//interface describing properties of Model
export interface EmpMonthModel extends mongoose.Model<EmpMonthDoc> {
  build(attrs: EmpMonthAttrs): EmpMonthDoc;
}
