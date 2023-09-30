import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 6000,
  jwtKey: process.env.JWT_KEY,
  mongoUrl: process.env.MONGO_URL,
  rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://localhost:5672",
  empUrl : process.env.EMPLOYEE_BASE_URL
};
