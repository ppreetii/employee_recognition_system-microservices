import {
  Publisher,
  DeleteEmployeeEvent,
  RoutingKeys,
  ExchangeTypes,
  Exchange,
} from "@reward-sys/rabbitmq";
import { Options } from "amqplib";

export class DeleteEmployeePublisher extends Publisher<DeleteEmployeeEvent> {
  readonly routingKey = RoutingKeys.DeleteEmployee;
  readonly exchange = Exchange.Auth;
  readonly exchangeType = ExchangeTypes.Direct;
  protected publishOptions?: Options.Publish | undefined = {
    persistent: true,
  };
}
