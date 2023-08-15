import express from "express";
import {
  validateRequest,
  requireAuth,
  hasPermissions,
  EmployeeActions,
} from "@reward-sys/common";

import { API } from "../../constants/api";
import empController from "../../controllers/v1/employee";
import { createEmployeeSchema } from "../../validation-schema/createEmployee";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  hasPermissions(EmployeeActions.CreateEmployee),
  validateRequest(createEmployeeSchema),
  empController.createEmployee
);

export { router as employeeRoutes };
