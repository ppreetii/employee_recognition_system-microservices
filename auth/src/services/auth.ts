import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
  BadRequestError,
  NotAuthorizedError,
  Roles,
  rabbitmq,
} from "@reward-sys/common";

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
     const employee = Auth.build({ email, password, role , employeeId});
     await employee.save();

     new NewEmployeePublisher(rabbitmq.client).publish({
      email: employee.email,
      employeeId : employee.employeeId
     })
   
     return {
       email: employee.email,
     };
  } catch (error) {
    throw error;
  }
 
};

const login = async (email: string, password: string) => {
  try {
    const existingUser = await Auth.findOne({
      email,
      is_active: 1
    });

    if (!existingUser) {
      throw new NotAuthorizedError();
    }

    const pswdMatch = await Password.compare(existingUser.password, password);
    if(!pswdMatch){
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
      email: existingUser.email
    };
  } catch (error) {
    throw error;
  }
  
};

export default {
  signup,
  login
};
