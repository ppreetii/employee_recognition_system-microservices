import mongoose from "mongoose";
import { addDaysToDate } from "@reward-sys/common";

const id = new mongoose.Types.ObjectId().toHexString();

const today = new Date();

const validReq = {
    summary: "Test Task Summary",
    description: "Test Task Description",
    employeeId: new mongoose.Types.ObjectId().toHexString() ,
    deadline: addDaysToDate(today, 3)
}

const invalidReq = {
    summary: 1243,
    description: 243 ,
    employeeId: "12" ,
    deadline: "12-01-2021"  //must be in yyyy-mm-dd
}

export default{
    validReq,
    invalidReq,
    id
}