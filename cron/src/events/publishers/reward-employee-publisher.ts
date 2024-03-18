import {
    Publisher,
    RewardEvent,
    RoutingKeys,
    ExchangeTypes,
    Exchange
  } from "@reward-sys/rabbitmq";
  import { Options } from "amqplib";
  
  export class RewardEmployeePublisher extends Publisher<RewardEvent> {
    readonly routingKey = RoutingKeys.RewardedEmployee;
    readonly exchange = Exchange.Reward;
    readonly exchangeType = ExchangeTypes.Direct;
    protected publishOptions?: Options.Publish | undefined = {
      persistent: false
    }
  }
  