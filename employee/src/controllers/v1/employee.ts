import { Request, Response, NextFunction } from "express";

import { EmployeeAttrs } from "../../models/employee";
import employeeService from "../../services/employee";

const createEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: EmployeeAttrs = req.body;
    const resData = await employeeService.createEmployee(data);

    res.status(201).json(resData);
  } catch (error) {
    next(error);
  }
};

export default {
  createEmployee,
};
