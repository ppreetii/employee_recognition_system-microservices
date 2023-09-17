import mongoose from "mongoose";

import { app } from "./app";
import config from "./configs/config";
import { rabbitmq } from "@reward-sys/common";
import { NewEmployeeListener } from "./events/listeners/new-employee-listener";

const checkEnvironmentVars = () => {
  if (!config.jwtKey) {
    throw new Error("JWT_KEY Not Provided");
  }
  if (!config.mongoUrl) {
    throw new Error("MONGO_URL Not Provided");
  }
};

const startServer = async () => {
  checkEnvironmentVars();
  
  await rabbitmq.connect(config.rabbitmqUrl);
  console.log("Connected to RabbitMQ");
  rabbitmq.client.on("close", () => {
    console.log("RabbitMq Connection Closed.");
    process.exit();
  });

  process.on("SIGINT", () => {
    rabbitmq.client.close();
    mongoose.connection.close();
  });
  process.on("SIGTERM", () => {
    rabbitmq.client.close();
    mongoose.connection.close();
  });

  new NewEmployeeListener(rabbitmq.client).subscribe();
  
  await mongoose.connect(config.mongoUrl!);
  console.log("Connected to Database");
  app.listen(config.port, () => {
    console.log(`Employee Service Listening on : ${config.port}`);
  });
};

startServer();
