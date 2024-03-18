import { Channel, Message } from "amqplib";

import {
  Listener,
  RoutingKeys,
  RewardEvent,
  ExchangeTypes,
  Exchange,
  Queue,
  Reward,
} from "@reward-sys/rabbitmq";


export class RewardEmployeeListener extends Listener<RewardEvent> {
  readonly routingKey = RoutingKeys.RewardedEmployee;
  readonly queue = Queue.Reward;
  readonly exchange = Exchange.Reward;
  readonly exchangeType = ExchangeTypes.Direct;
  protected retry: number = 0;

  onMessage(data: { type: Reward }, channel: Channel, msg: Message): void {
    try {
      channel.ack(msg);
      console.log(`Reward ${data.type} Msg Processed Successfully in Task Srv`);
    } catch (error: any) {
      throw error;
    }
  }
}
