import mongoose from "mongoose";

import { app } from "./app";
import config from "./configs/config";
import { rabbitmq } from "@reward-sys/common";

const checkEnvironmentVars = () => {
   if (!config.mongoUrl) {
     throw new Error("Mongo Url Not Provided");
   }
   if (!config.jwtKey) {
     throw new Error("JWT_KEY Not Provided");
   }
};


const startServer = async () =>{
    checkEnvironmentVars();
    await rabbitmq.connect(config.rabbitmqUrl);
    console.log("Connected to RabbitMQ");
    rabbitmq.client.on("close", () => {
      console.log("RabbitMq Connection Closed.");
      process.exit(1);
    });

    process.on("SIGINT", () => rabbitmq.client.close());
    process.on("SIGTERM", () => rabbitmq.client.close());

    await mongoose.connect(config.mongoUrl!);
    console.log("Connected to Database")
    app.listen(config.port, () => {
      console.log(`Auth Service Listening on : ${config.port}`);
    });
}

startServer();

