import joi from "joi";

import {isValidDate} from "@reward-sys/common";

export const createEmployeeSchema = joi.object().keys({
  name: joi.string().required(),
  contact: joi.string().required(),
  personal_email: joi.string().email().required(),
  email: joi.string().email().required(),
  birthDate: joi.string().required().custom(isValidDate),
  address: joi.string().required(),
  projectId: joi.string(),
  departmentId: joi.string(),
  designation: joi.string().required(),
});
