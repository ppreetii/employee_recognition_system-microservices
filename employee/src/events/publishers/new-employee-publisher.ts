import {
    Publisher,
    NewEmployeeEvent,
    RoutingKeys,
    ExchangeTypes,
    Exchange
  } from "@reward-sys/rabbitmq";
  import { Options } from "amqplib";
  
  export class NewEmployeePublisher extends Publisher<NewEmployeeEvent> {
    readonly routingKey = RoutingKeys.NewEmployee;
    readonly exchange = Exchange.Project;
    readonly exchangeType = ExchangeTypes.Direct;
    protected publishOptions?: Options.Publish | undefined = {
      persistent: false
    }
  }
  