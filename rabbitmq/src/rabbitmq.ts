import amqplib from "amqplib";

import config from "./configs/config";

class RabbitMQ {
  private _client?: amqplib.Connection;

  get client() {
    if (!this._client) {
      throw new Error("Cannot Access RabbitMQ before connecting");
    }
    return this._client;
  }

  async connect() {
    try {
      this._client = await amqplib.connect(config.rabbitmqUrl);
    } catch (error) {
      throw error;
    }
  }
}

export const rabbitmq = new RabbitMQ();
