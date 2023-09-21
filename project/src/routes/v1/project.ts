import express from "express";
import {
  validateRequest,
  requireAuth,
  hasPermissions,
  ProjectActions,
} from "@reward-sys/common";

import projectController from "../../controllers/v1/project";
import { createProjectSchema } from "../../validation-schema/project";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  hasPermissions(ProjectActions.CreateProject),
  validateRequest(createProjectSchema),
  projectController.createProject
);

router.get(
  "/",
  requireAuth,
  hasPermissions(ProjectActions.GetAllProjects),
  projectController.getAllProjects
);

export { router as projectRoutes };
