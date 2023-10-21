import express from "express";
import {
  validateRequest,
  requireAuth,
  hasPermissions,
  ProjectActions,
} from "@reward-sys/common";

import projectController from "../../controllers/v1/project";
import { createProjectSchema,updateProjectSchema } from "../../validation-schema/project";
import { API } from "../../constants/api";

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

router.get(
  `${API.PROJ_ID}`,
  requireAuth,
  hasPermissions(ProjectActions.GetProjectById),
  projectController.getProjectById
);

router.patch(
  `${API.PROJ_ID}`,
  requireAuth,
  hasPermissions(ProjectActions.UpdateProject),
  validateRequest(updateProjectSchema),
  projectController.updateProject
);

router.delete(
  `${API.PROJ_ID}`,
  requireAuth,
  hasPermissions(ProjectActions.CloseProject),
  projectController.deleteProject
)

export { router as projectRoutes };
