import { app } from "./app";
import config from "./configs/config";
import { sequelize } from "./db";

const checkEnvironmentVars = () => {
  if (!config.jwtKey) {
    throw new Error("JWT_KEY Not Provided");
  }
};

const startServer = async () => {
  try {
    checkEnvironmentVars();
    await sequelize.sync();
    console.log("Database connected!");
    app.listen(config.port, () => {
      console.log(`Auth Service Listening on : ${config.port}`);
    });
  } catch (error) {
    throw error;
  }
};

startServer();
