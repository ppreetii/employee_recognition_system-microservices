import mongoose from "mongoose";
import { Roles } from "@reward-sys/common";

import { Auth } from "../../src/models/auth";

export const createAccount = async (
  email: string,
  password: string,
  role: Roles
) => {
  const employeeId = new mongoose.Types.ObjectId();
  const employee = Auth.build({
    email,
    password,
    role,
    employeeId,
  });
  await employee.save();
};
