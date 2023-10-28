import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 7000,
  jwtKey: process.env.JWT_KEY,
  rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://localhost:5672",
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  
};