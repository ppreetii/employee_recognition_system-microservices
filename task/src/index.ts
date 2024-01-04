import { rabbitmq } from "@reward-sys/rabbitmq";

import { app } from "./app";
import config from "./configs/config";
import SequelizeConnection from "./db/connection";

const checkEnvironmentVars = () => {
  if (!config.jwtKey) {
    throw new Error("JWT_KEY Not Provided");
  }
};

const startServer = async () => {
  try {
    checkEnvironmentVars();

    await rabbitmq.connect(config.rabbitmqUrl);
    console.log("Connected to RabbitMQ");

    const db = await SequelizeConnection.connect();
    await db.sync();
    console.log("Database connected!");
    app.listen(config.port, () => {
      console.log(`Task Service Listening on : ${config.port}`);
    });
  } catch (error) {
    console.log(error)
    throw error;
  }
};

startServer();
