import { Connection, Channel } from "amqplib";

export const rabbitmq = {
  client: {
    createChannel: jest.fn(async () => {
      // Create and return a mock connection
      let mockConnection = {
        createChannel: jest.fn(async () => {
          return {} as unknown as Channel;
        }),
        assertExchange: jest.fn(async () => Promise.resolve()),
        assertQueue: jest.fn(async () => Promise.resolve()), // Resolve a promise
        publish: jest.fn(async () => Promise.resolve(true)), // Resolve the promise when publish is called
        bindQueue: jest.fn(),
        consume: jest.fn(async () => Promise.resolve()),
        ack: jest.fn(),
      } as unknown as Connection;

      return mockConnection;
    })
  },
};
