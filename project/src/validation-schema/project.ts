import joi from "joi";

export const createProjectSchema = joi
  .object()
  .keys({
    name: joi.string().required(),
    client_id: joi.string().required(),
    manager_id: joi.string(),
  })
  .required();
