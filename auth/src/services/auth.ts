import jwt from "jsonwebtoken";
import { BadRequestError , NotAuthorizedError, Active} from "@reward-sys/common";

import { Auth } from "../models/auth";
import { Password } from "../utils/password";
import config from "../configs/config";

const signup = async (email: string, password: string) => {
  try {
     const existingUser = await Auth.findOne({
       email,
     });
     if (existingUser) {
       throw new BadRequestError("Email already exists");
     }

     const employee = Auth.build({ email, password });
     await employee.save();
   
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
      is_active: { $in: [Active.New, Active.Employee] }
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
        id: existingUser.id,
        empId: existingUser.employeeId,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );


    return {
      jwt: userJwt,
      email: existingUser.email,
    };
  } catch (error) {
    throw error;
  }
  
};

export default {
  signup,
  login
};
