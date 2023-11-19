import joi from "joi";
import { formatDateIST, isValidMongoId} from "@reward-sys/common";

export const createTaskSchema = joi.object().keys({
    summary: joi.string().required(),
    projectId: joi.string().required().custom(isValidMongoId),
    description: joi.string(),
    employeeId: joi.string().when("deadline", {
      is: joi.exist(),
      then: joi.required(),
      otherwise: joi.optional(),
    }).custom(isValidMongoId),
    deadline: joi
      .date()
      .min(`${formatDateIST(new Date())}`),
});

