import joi from "joi";

export const createProjectSchema = joi
  .object()
  .keys({
    name: joi.string().required(),
    client_id: joi.string().required(),
    manager_id: joi.string(),
  })
  .required();

export const updateProjectSchema = joi.object().keys({
  manager_id : joi.string(),
  members : joi.array().items(joi.string())
}).required();