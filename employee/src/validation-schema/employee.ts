import joi from "joi";

import {isValidDate} from "@reward-sys/common";
import { VALIDATION } from "../constants/validation";

export const createEmployeeSchema = joi.object().keys({
  name: joi.string().required(),
  contact: joi
    .string()
    .length(VALIDATION.CONTACT_LEN)
    .pattern(/^[0-9]+$/)
    .message(VALIDATION.MSG.INVALID_CONTACT)
    .required(),
  personal_email: joi.string().email().required(),
  email: joi.string().email().required(),
  birthDate: joi.string().required().custom(isValidDate),
  address: joi.string().required(),
  projectId: joi.string(),
  departmentId: joi.string(),
  designation: joi.string().required(),
});

export const updateEmployeeSchema = joi.object().keys({
  contact: joi
    .string()
    .length(VALIDATION.CONTACT_LEN)
    .pattern(/^[0-9]+$/)
    .message(VALIDATION.MSG.INVALID_CONTACT),
  personal_email: joi.string().email(),
  address: joi.string(),
  projectId: joi.string(),
  departmentId: joi.string(),
  designation: joi.string(),
});
