import mongoose from "mongoose";

import { Employee } from "../../src/models/employee";

export const createAccount = async (email: string) => { //this is done by rabbitmq listener, but we have to do it manually for test cases
  const id = new mongoose.Types.ObjectId();

  const employee = Employee.build({
    id,
    email
  });

  await employee.save();

  return id;
};
