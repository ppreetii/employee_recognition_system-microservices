import amqplib from "amqplib";

class RabbitMQ {
  private _client?: amqplib.Connection;

  get client() {
    if (!this._client) {
      throw new Error("Cannot Access RabbitMQ before connecting");
    }
    return this._client;
  }

  async connect(url: string) {
    try {
      this._client = await amqplib.connect(url);
    } catch (error) {
      throw error;
    }
  }
}

export const rabbitmq = new RabbitMQ();
