import {
  Publisher,
  DeleteEmployeeEvent,
  RoutingKeys,
  ExchangeTypes,
  Exchange,
} from "@reward-sys/common";
import { Options } from "amqplib";

export class DeleteEmployeePublisher extends Publisher<DeleteEmployeeEvent> {
  readonly routingKey = RoutingKeys.DeleteEmployee;
  readonly queue = RoutingKeys.DeleteEmployee;
  readonly exchange = Exchange.Employee;
  readonly exchangeType = ExchangeTypes.Direct;
  protected publishOptions?: Options.Publish | undefined = {
    persistent: true,
  };
}
