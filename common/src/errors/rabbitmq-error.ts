import { CustomError } from "./custom-error";

export class ChannelCreationError extends CustomError {
  statusCode = 500;
  
  constructor() {
    super("Failed while creating RabbitMQ Channel");
    Object.setPrototypeOf(this, ChannelCreationError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: "Failed while creating RabbitMQ Channel"
      },
    ];
  }
}
