import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { rabbitmq } from "./__mocks__/rabbitmq";

import config from "../src/configs/config";

declare global {
  var signin: (role: string, id ?: string) => string[];
}

let mongo: any;


beforeAll(async () => {
  process.env.JWT_KEY = config.jwtKey;
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

// mock the functions
jest.mock("@reward-sys/rabbitmq", () => {
  const originalModule = jest.requireActual("@reward-sys/rabbitmq");
  return {
    ...originalModule,
    rabbitmq
  };
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
  }
});

global.signin = (role: string, id ?: string) => {
  const token = jwt.sign(
    {
      id: id ?? new mongoose.Types.ObjectId().toHexString(),
      email: "test@test.com",
      role,
    },
    process.env.JWT_KEY!
  );
  const sessionJSON = JSON.stringify({
    jwt: token,
  });

  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`session=${base64}`];
};
