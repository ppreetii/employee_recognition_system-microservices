import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
  BadRequestError,
  NotAuthorizedError,
  Roles,
} from "@reward-sys/common";
import { rabbitmq,Queue } from "@reward-sys/rabbitmq";

import { Auth } from "../models/auth";
import { Password } from "../utils/password";
import { NewEmployeePublisher } from "../events/publishers/new-employee-publisher";

const signup = async (email: string, password: string, role: Roles) => {
  try {
    const existingUser = await Auth.findOne({
      email,
    });
    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }

    const employeeId = new mongoose.Types.ObjectId();
    const account = Auth.build({ email, password, role, employeeId });
    await account.save();

    new NewEmployeePublisher(rabbitmq.client).publish(
      {
        email: account.email,
        employeeId: account.employeeId,
      },
      [Queue.Employee]
    );

    return {
      email: account.email,
    };
  } catch (error) {
    throw error;
  }
};

const login = async (email: string, password: string) => {
  try {
    const existingUser = await Auth.findOne({
      email,
      is_active: 1,
    });

    if (!existingUser) {
      throw new NotAuthorizedError();
    }

    const pswdMatch = await Password.compare(existingUser.password, password);
    if (!pswdMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    const userJwt = jwt.sign(
      {
        id: existingUser.employeeId,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_KEY!,
      {
        expiresIn: "1h",
      }
    );

    return {
      token: userJwt,
      email: existingUser.email,
    };
  } catch (error) {
    throw error;
  }
};

export default {
  signup,
  login,
};
