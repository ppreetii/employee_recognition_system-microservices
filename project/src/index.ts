import mongoose from "mongoose";

import { app } from "./app";
import config from "./configs/config";
import { rabbitmq } from "@reward-sys/common";
import { NewEmployeeListener } from "./events/listeners/new-employee-listener";
import { DeleteEmployeeListener } from "./events/listeners/delete-employee-listener";

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

  //adding listners
  new NewEmployeeListener(rabbitmq.client).subscribe();
  new DeleteEmployeeListener(rabbitmq.client).subscribe();

  await mongoose.connect(config.mongoUrl!);
  console.log("Connected to Database");
  app.listen(config.port, () => {
    console.log(`Project Service Listening on : ${config.port}`);
  });
};

startServer();

process.on("SIGINT", async () => {
  rabbitmq.client.close();
});
process.on("SIGTERM", async () => {
  rabbitmq.client.close();
});
