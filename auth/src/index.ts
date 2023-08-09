import mongoose from "mongoose";

import { app } from "./app";
import config from "./configs/config";

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
    await mongoose.connect(config.mongoUrl!);
    console.log("Connected to Database")
    app.listen(config.port, () => {
      console.log(`Auth Service Listening on : ${config.port}`);
    });
}

startServer();

