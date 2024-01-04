import mongoose from "mongoose";

//interface that describes attributes we give to Employee Model to create record
export interface EmpAttrs {
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  designation: string;
}

//interface that describes attributes Employee Model has
export interface EmpModel {
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  designation: string;
  is_active: number;
  createdAt?: Date;
  updatedAt?: Date;
}

//interface that describes attributes of Employee record returned upon query
export interface EmpRec {
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  designation: string;
  is_active: number;
}
