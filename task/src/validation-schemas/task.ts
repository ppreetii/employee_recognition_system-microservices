import joi from "joi";
import { formatDateIST, isValidMongoId } from "@reward-sys/common";

import { COMMON } from "../constants/common";

export const createTaskSchema = joi.object().keys({
  summary: joi.string().required(),
  projectId: joi.string().required().custom(isValidMongoId),
  description: joi.string(),
  employeeId: joi
    .string()
    .when("deadline", {
      is: joi.exist(),
      then: joi.required(),
      otherwise: joi.optional(),
    })
    .custom(isValidMongoId),
  deadline: joi.date().min(`${formatDateIST(new Date())}`),
});

export const updateTaskSchema = joi.object().keys({
  summary: joi.string().required(),
  description: joi.string().required(),
  status: joi
    .string()
    .valid(
      COMMON.TASK_STATUS.TODO,
      COMMON.TASK_STATUS.INPROGRESS,
      COMMON.TASK_STATUS.DONE
    )
    .required(),
  deadline: joi.date().min(`${formatDateIST(new Date())}`),
  employeeId: joi
    .string()
    .when("deadline", {
      is: joi.exist(),
      then: joi.required(),
      otherwise: joi.optional(),
    })
    .custom(isValidMongoId),
});
