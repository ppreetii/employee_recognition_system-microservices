import { Connection , Options} from "amqplib";

import { EXCHANGE, ExchangeTypes } from "./exhanges/exchange";

interface Event {
    routingKey: string;
    queue: string;
    message: any;
}

export abstract class Publisher<T extends Event> {
  abstract routingKey: T["routingKey"];
  abstract queue: T["queue"];

  protected rabbitmq: Connection;
  protected publishOptions?: Options.Publish;
  protected assertQueueOptions?: Options.AssertQueue;
  protected assertExchangeOptions?: Options.AssertQueue;
 
  constructor(rabbitmq: Connection) {
    this.rabbitmq = rabbitmq;
  }

  async publish(data: T["message"]): Promise<void> {
    try {
      const channel = await this.rabbitmq.createChannel();
      await channel.assertExchange(EXCHANGE, ExchangeTypes.Direct, this.assertExchangeOptions);
      channel.assertQueue(this.queue, this.assertQueueOptions)
      // channel.publish(EXCHANGE, this.routingKey, Buffer.from(JSON.stringify(data)),this.publishOptions);
      channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(data)),this.publishOptions)
      console.log("Event Published to: ", this.routingKey, " with data: ", data);
    } catch (error) {
      throw error;
    }
  }
}