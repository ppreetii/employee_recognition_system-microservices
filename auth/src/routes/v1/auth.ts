import express from "express";
import {validateRequest} from "@reward-sys/common";

import { API } from "../../constants/api";
import { signupLoginSchema } from "../../validation-schemas/signup";

import authController from "../../controllers/v1/auth";

const router = express.Router();

router.post(
  `${API.SIGNUP}`,
  validateRequest(signupLoginSchema),
  authController.signup
);
router.post(
  `${API.LOGIN}`,
  validateRequest(signupLoginSchema),
  authController.login
);
router.post(
  `${API.LOGOUT}`,
  authController.logout
);

export {router as authRoutes};