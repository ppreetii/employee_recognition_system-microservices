import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { NotAuthorizedError } from "../errors/not-authorized-error";
import { config } from "../configs/config";


interface UserPayload {
  id: string;
  email: string;
  empId?: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}


export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next(new NotAuthorizedError());
  }

  try {
    const payload = jwt.verify(req.session.jwt, config.jwtKey!) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    return next(err);
  }

  next();
};
