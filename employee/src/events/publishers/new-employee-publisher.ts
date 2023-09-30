import {
    Publisher,
    NewEmployeeEvent,
    RoutingKeys,
    ExchangeTypes,
    Exchange,
    Queue
  } from "@reward-sys/common";
  import { Options } from "amqplib";
  
  export class NewEmployeePublisher extends Publisher<NewEmployeeEvent> {
    readonly routingKey = RoutingKeys.NewEmployee;
    readonly exchange = Exchange.Project;
    readonly exchangeType = ExchangeTypes.Direct;
    protected publishOptions?: Options.Publish | undefined = {
      persistent: false
    }
  }
  