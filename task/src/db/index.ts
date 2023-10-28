import { Sequelize } from "sequelize";
import config from "../configs/config";

const environment = process.env.NODE_ENV;

let dbName =
  environment === "production"
    ? `${config.dbName}_prod`
    : environment === "development"
    ? `${config.dbName}_dev`
    : `${config.dbName}_test`;

export const sequelize = new Sequelize(
  dbName,
  config.dbUser!,
  config.dbPassword,
  {
    dialect: "postgres",
    host: config.dbHost,
    logging: false
  }
);
