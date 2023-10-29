import Task from "./task";
import SequelizeConnection from "../connection";

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV !== 'test';

const sequelize = SequelizeConnection.getInstance();

const db = async () => Promise.all([
    Task.sync({ alter: isDev || isTest })
]);

db.sequelize = sequelize;

export default db;