import { Request, Response, NextFunction } from "express";

import authService from "../../services/auth";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const data = await authService.signup(email, password);
    res.status(201).json({ email: data.email });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    
    req.session = {
      jwt: data.jwt,
    };

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const logout = (req: Request, res: Response) =>{
  req.session = null;
  res.json({});
}

export default {
  signup,
  login,
  logout
};
