import express from "express";
import {
  validateRequest,
  hasPermissions,
  requireAuth,
  AuthActions
} from "@reward-sys/common";

import { API } from "../../constants/api";
import { SignupSchema, LoginSchema } from "../../validation-schemas/signup";

import authController from "../../controllers/v1/auth";

const router = express.Router();

router.post(
  `${API.SIGNUP}`,
  requireAuth,
  hasPermissions(AuthActions.SignUp),
  validateRequest(SignupSchema),
  authController.signup
);
router.post(`${API.LOGIN}`, validateRequest(LoginSchema), authController.login);
router.post(`${API.LOGOUT}`, authController.logout);

export { router as authRoutes };
