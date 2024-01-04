import express from "express";
import {
  validateRequest,
  hasPermissions,
  requireAuth,
  TaskActions
} from "@reward-sys/common";

import { API } from "../../constants/api";
import { createTaskSchema, updateTaskSchema} from "../../validation-schemas/task";

import taskController from "../../controllers/v1/task";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  hasPermissions(TaskActions.CreateTask),
  validateRequest(createTaskSchema),
  taskController.createTask
);

router.get(
  "/",
  requireAuth,
  hasPermissions(TaskActions.GetTasks),
  taskController.getAllTasks
);

router.get(
  `${API.TASK_ID}`,
  requireAuth,
  hasPermissions(TaskActions.GetTaskById),
  taskController.getTask
);

router.delete(
  `${API.TASK_ID}`,
  requireAuth,
  hasPermissions(TaskActions.DeleteTask),
  taskController.deleteTask
);

router.put(
  `${API.TASK_ID}`,
  requireAuth,
  hasPermissions(TaskActions.DeleteTask),
  validateRequest(updateTaskSchema),
  taskController.updateTask
)

export { router as taskRoutes };
