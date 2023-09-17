import { CustomError } from "./custom-error";

export class PageNotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Page Not Found Error");
    Object.setPrototypeOf(this, PageNotFoundError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: "Page Not Found",
      },
    ];
  }
}
