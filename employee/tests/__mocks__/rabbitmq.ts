import { Connection, Channel } from "amqplib";

let mockConnection: Connection | undefined;
let mockChannel: Channel | undefined;

export const rabbitmq = {
  client: {
    createChannel: jest.fn(async () => {
      if (mockConnection) {
        return mockConnection;
      }

      // Create and return a mock connection
      mockConnection = {
        createChannel: async () => {

            if (!mockChannel) {
              mockChannel = {
                publish: async () => true, // Mock the publish method to always return true
                consume: async () => undefined, // Mock the consume method
              } as unknown as Channel;
            }

          return mockChannel;
        },
        assertExchange: jest.fn(async () => Promise.resolve()),
        assertQueue: jest.fn(async () => Promise.resolve()), // Resolve a promise
        publish: jest.fn(async () => Promise.resolve(true)) // Resolve the promise when publish is called
      } as unknown as Connection;

      return mockConnection;
    }),
    close: jest.fn(() => {
      mockConnection = undefined;
      mockChannel = undefined;
    }),
  },
};
