import {ValidationError} from "joi";

import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode: number = 400;
  constructor(public errors: ValidationError) {
    super("Validation Error");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
      return [
        {
          message: "Validation Error",
          field: this.errors.details?.map((err) => err.message).join(" ; "),
        },
      ];
  }
}