import joi from "joi";

export const createEmployeeSchema = joi.object().keys({
  name: joi.string().required(),
  contact: joi.string().required(),
  personal_email: joi.string().email().required(),
  email: joi.string().email().required(),
  birthDate: joi.date().required(),
  address: joi.string().required(),
  projectId: joi.string(),
  departmentId: joi.string(),
  designation: joi.string().required()
});