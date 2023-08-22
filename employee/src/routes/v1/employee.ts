import express from "express";
import {
  validateRequest,
  requireAuth,
  hasPermissions,
  EmployeeActions,
} from "@reward-sys/common";

import { API } from "../../constants/api";
import empController from "../../controllers/v1/employee";
import { createEmployeeSchema } from "../../validation-schema/employee";

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



export { router as employeeRoutes };
