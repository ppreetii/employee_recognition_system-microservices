import {
  Publisher,
  NewEmployeeEvent,
  RoutingKeys,
  ExchangeTypes,
  Exchange
} from "@reward-sys/common";
import { Options } from "amqplib";

export class NewEmployeePublisher extends Publisher<NewEmployeeEvent> {
  readonly routingKey = RoutingKeys.NewEmployee;
  readonly queue = RoutingKeys.NewEmployee;
  readonly exchange = Exchange.Employee;
  readonly exchangeType = ExchangeTypes.Direct;
  protected publishOptions?: Options.Publish | undefined = {
    persistent: false
  }
}
