import { Channel, Message } from "amqplib";
import mongoose from "mongoose";
import {
  Listener,
  RoutingKeys,
  WinnerEvent,
  ExchangeTypes,
  Exchange,
  Queue,
  Reward,
} from "@reward-sys/rabbitmq";

export class WinnerEmployeeListener extends Listener<WinnerEvent> {
  readonly routingKey = RoutingKeys.WinnerEmployee;
  readonly queue = Queue.Reward;
  readonly exchange = Exchange.Reward;
  readonly exchangeType = ExchangeTypes.Direct;
  protected retry: number = 0;
  onMessage(
    data: { type: Reward; data: any },
    channel: Channel,
    msg: Message
  ): void {
    try {
      /*
        TODO : Add Logic
        Depending on type, add to data to respective table
         */
    } catch (error) {
      throw error;
    }
  }
}
