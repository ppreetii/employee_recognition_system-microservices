import { Request, Response, NextFunction } from "express";
import joi from "joi";

import { RequestValidationError } from "../errors/request-validation-error";

export const validateRequest = (schema: joi.ObjectSchema) =>
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      await schema.validateAsync(req.body, {
        abortEarly: false
      });
      next();
    } catch (error) {
      if (error instanceof joi.ValidationError) {
        next(new RequestValidationError(error));
      }
    }
  };
