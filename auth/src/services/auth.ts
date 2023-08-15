import jwt from "jsonwebtoken";
import { BadRequestError , NotAuthorizedError, Active, Roles} from "@reward-sys/common";

import { Auth } from "../models/auth";
import { Password } from "../utils/password";

const signup = async (email: string, password: string, role: Roles) => {
  try {
     const existingUser = await Auth.findOne({
       email,
     });
     if (existingUser) {
       throw new BadRequestError("Email already exists");
     }

     const employee = Auth.build({ email, password, role });
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
