import Task from "./task";
import Employee from "./employee";
import SequelizeConnection from "../connection";

const isDev = process.env.NODE_ENV === 'development';

const sequelize = SequelizeConnection.getInstance();

const db = async () => Promise.all([
    Task.sync({ alter: isDev  }),
    Employee.sync({ alter: isDev}),
]);

db.sequelize = sequelize;

export default db;