import { rabbitmq } from "@reward-sys/rabbitmq";

import { app } from "./app";
import config from "./configs/config";
import SequelizeConnection from "./db/connection";
import { NewEmployeeListener } from "./events/listeners/new-employee-listener";
import { RewardEmployeeListener } from "./events/listeners/reward-employee-listener";

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

    new NewEmployeeListener(rabbitmq.client).subscribe();
    new RewardEmployeeListener(rabbitmq.client).subscribe();

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
