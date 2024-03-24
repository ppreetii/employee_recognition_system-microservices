import {
  Publisher,
  WinnerEvent,
  RoutingKeys,
  ExchangeTypes,
  Exchange,
} from "@reward-sys/rabbitmq";
import { Options } from "amqplib";

export class WinnerEmployeePublisher extends Publisher<WinnerEvent> {
  readonly routingKey = RoutingKeys.WinnerEmployee;
  readonly exchange = Exchange.Reward;
  readonly exchangeType = ExchangeTypes.Direct;
  protected publishOptions?: Options.Publish | undefined = {
    persistent: false,
  };
}
