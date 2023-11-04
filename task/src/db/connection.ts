import { Sequelize } from "sequelize";
import config from "../configs/config";
import { DatabaseConnectionError } from "@reward-sys/common";

const environment = process.env.NODE_ENV;

let dbName =
  environment === "production"
    ? `${config.dbName}_prod`
    : environment === "development"
    ? `${config.dbName}_dev`
    : `${config.dbName}_test`;

class SequelizeConnection {
  private static instance: Sequelize;

  static getInstance(): Sequelize {
    if (!SequelizeConnection.instance) {
      SequelizeConnection.instance = new Sequelize(
        dbName,
        config.dbUser!,
        config.dbPassword,
        {
          dialect: "postgres",
          host: config.dbHost,
          logging: false,
          pool: {
            max: 30,
            acquire: 60000,
            idle: 30000,
          },
        }
      );
    }

    return SequelizeConnection.instance;
  }

  static async connect(): Promise<Sequelize> {
    try {
      const sequelize = SequelizeConnection.getInstance();
      await sequelize.authenticate();
      return sequelize;
    } catch (error) {
      throw new DatabaseConnectionError()
    }
  }

  static async close(): Promise<void> {
    try {
      const sequelize = SequelizeConnection.getInstance();
      await sequelize.close();
    } catch (error) {
      throw error;
    }
  }
}

export default SequelizeConnection;
