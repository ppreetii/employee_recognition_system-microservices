import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import SequelizeConnection from "../src/db/connection";
import config from "../src/configs/config";

declare global {
  var signin: (role: string, id?: string) => string[];
}

let sequelize: any;

beforeAll(async () => {
  try {
    process.env.JWT_KEY = config.jwtKey;
    sequelize = await SequelizeConnection.connect();
    await sequelize.sync({
      force: true
    });
  } catch (error) {
    throw error;
  }
});

beforeEach(async () => {
  try {
    jest.clearAllMocks();
    await sequelize.truncate({ cascade: true, restartIdentity: true });
  } catch (error) {
    throw error;
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
  } catch (error) {
    throw error;
  }
});

global.signin = (role: string, id?: string) => {
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
