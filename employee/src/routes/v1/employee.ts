import express from "express";
import { validateRequest , requireAuth } from "@reward-sys/common";

import { API } from "../../constants/api";
import empController from "../../controllers/v1/employee";

const router = express.Router();

router.post("/", requireAuth,empController.createEmployee )

export { router as employeeRoutes };
