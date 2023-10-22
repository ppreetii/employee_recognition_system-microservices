import { Connection , Options} from "amqplib";

import { Event } from "./types/event-type";

export abstract class Publisher<T extends Event> {
  abstract routingKey: T["routingKey"];
  abstract exchange: T["exchange"];
  abstract exchangeType: T["exchangeType"];

  protected rabbitmq: Connection;
  protected publishOptions?: Options.Publish;
  protected assertQueueOptions?: Options.AssertQueue;
  protected assertExchangeOptions?: Options.AssertQueue;

  constructor(rabbitmq: Connection) {
    this.rabbitmq = rabbitmq;
  }

  async publish(data: T["message"], queues: string[]): Promise<void> {
    try {
      const channel = await this.rabbitmq.createChannel();
      await channel.assertExchange(
        this.exchange,
        this.exchangeType,
        this.assertExchangeOptions
      );
      queues.forEach(queue => {
        channel.assertQueue(queue, this.assertQueueOptions);
      });
      channel.publish(
        this.exchange,
        this.routingKey,
        Buffer.from(JSON.stringify(data)),
        this.publishOptions
      );
      console.log(
        "Event Published to: ",
        this.routingKey,
        " with data: ",
        JSON.stringify(data)
      );
    } catch (error) {
      throw error;
    }
  }
}