import express from "express";
import {
  validateRequest,
  requireAuth,
  hasPermissions,
  EmployeeActions,
} from "@reward-sys/common";

import { API } from "../../constants/api";
import empController from "../../controllers/v1/employee";
import {createEmployeeSchema, updateEmployeeSchema} from "../../validation-schema/employee";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  hasPermissions(EmployeeActions.CreateEmployee),
  validateRequest(createEmployeeSchema),
  empController.createEmployee
);

router.get(
  "/",
  requireAuth,
  hasPermissions(EmployeeActions.GetEmployees),
  empController.getEmployees
);

router.get(
  `${API.EMP_ID}`,
  requireAuth,
  hasPermissions(EmployeeActions.GetEmployeeById),
  empController.getEmployeeById
);

router.patch(
  `${API.EMP_ID}`,
  requireAuth,
  hasPermissions(EmployeeActions.UpdateEmployee),
  validateRequest(updateEmployeeSchema),
  empController.updateEmployee
);

router.delete(
  `${API.EMP_ID}`,
  requireAuth,
  hasPermissions(EmployeeActions.DeleteEmployee),
  empController.deleteEmployee
);



export { router as employeeRoutes };
