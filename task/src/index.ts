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
    const db = await SequelizeConnection.connect();
    await db.sync();
    console.log("Database connected!");
    app.listen(config.port, () => {
      console.log(`Task Service Listening on : ${config.port}`);
    });
  } catch (error) {
    throw error;
  }
};

startServer();
