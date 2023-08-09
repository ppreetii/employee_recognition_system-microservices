import { Connection, Options, Channel, Message } from "amqplib";

import { EXCHANGE, ExchangeTypes } from "./exhanges/exchange";

interface Event {
  routingKey: string;
  queue: string;
  message: any;
}

export abstract class Listener<T extends Event> {
  abstract routingKey: T["routingKey"];
  abstract queue: T["queue"];
  abstract onMessage(data: T["message"], channel: Channel, msg: Message): void;

  protected rabbitmq: Connection;

  protected assertQueueOptions?: Options.AssertQueue;
  protected assertExchangeOptions?: Options.AssertQueue;

  constructor(rabbitmq: Connection) {
    this.rabbitmq = rabbitmq;
  }

  async subscribe(): Promise<void> {
    try {
      const channel = await this.rabbitmq.createChannel();
      await channel.assertExchange(
        EXCHANGE,
        ExchangeTypes.Direct,
        this.assertExchangeOptions
      );
      channel.assertQueue(this.queue, this.assertQueueOptions);
      channel.bindQueue(this.queue, EXCHANGE, this.routingKey);
      await channel.consume(
        this.queue,
        async (data) => {
          if (data) {
            const content = this.parseMessage(data?.content);
            console.log(
              "Event Received on: ",
              this.routingKey,
              " with data: ",
              content
            );
            this.onMessage(content, channel, data);
          }
        },
        {
          noAck: false,
        }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  parseMessage(content: Buffer) {
    return JSON.parse(content.toString());
  }
}
