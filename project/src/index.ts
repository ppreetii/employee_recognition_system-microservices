import mongoose from "mongoose";

import { app } from "./app";
import config from "./configs/config";
import { rabbitmq } from "@reward-sys/common";

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
  await mongoose.connect(config.mongoUrl!);
  console.log("Connected to Database");
  app.listen(config.port, () => {
    console.log(`Project Service Listening on : ${config.port}`);
  });
};

startServer();