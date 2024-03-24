import { rabbitmq } from "@reward-sys/rabbitmq";
import mongoose from "mongoose";

import { app } from "./app";
import config from "./configs/config";
import { WinnerEmployeeListener } from "./events/listeners/winner-employee-listener";

const checkEnvironmentVars = () => {
  if (!config.jwtKey) {
    throw new Error("JWT_KEY Not Provided");
  }
  if (!config.mongoUrl) {
    throw new Error("MONGO_URL Not Provided");
  }
};

const startServer = async () => {
  try {
    checkEnvironmentVars();

    await rabbitmq.connect(config.rabbitmqUrl);
    console.log("Connected to RabbitMQ");

    new WinnerEmployeeListener(rabbitmq.client).subscribe();

    await mongoose.connect(config.mongoUrl!);
    console.log("Database connected!");
    app.listen(config.port, () => {
      console.log(`Reward Service Listening on : ${config.port}`);
    });
  } catch (error) {
    console.log(error)
    throw error;
  }
};

startServer();

process.on("SIGINT", async () => {
  rabbitmq.client.close();
});
process.on("SIGTERM", async () => {
  rabbitmq.client.close();
});