const dotenv = require('dotenv');

dotenv.config();

const dbData = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    seederStorage: "sequelize",
    logging: false,
}

module.exports = {
  development: {
    ...dbData,
    database: process.env.DB_NAME + "_dev",
  },
  test: {
    ...dbData,
    database: process.env.DB_NAME + "_test",
  },
  production: {
    ...dbData,
    database: process.env.DB_NAME + "_prod",
  },
};
