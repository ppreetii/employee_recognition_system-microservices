import { Request, Response, NextFunction } from "express";

import { EmployeeAttrs, UpdateEmployeeAttrs } from "../../types/employee";
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

const getEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.params?.page ?? 1;
    const data = await employeeService.getEmployees(+page);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const empId = req.params.empId;
    const role = req.currentUser?.role!;
    const loginId = req.currentUser?.id!;
    const data = await employeeService.getEmployeeById(empId, role, loginId)

    res.json(data);
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const empId = req.params.empId;
    const role = req.currentUser?.role!;
    const loginId = req.currentUser?.id!;
    const data: UpdateEmployeeAttrs = req.body;

    const employee = await employeeService.updateEmployee(empId, role, loginId, data);

    res.json(employee);
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const empId = req.params.empId;
    const role = req.currentUser?.role!;
    
    await employeeService.deleteEmployee(
      empId,
      role,
    );

    res.status(204).json({});
  } catch (error) {
    next(error);
  }
};

export default {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};
