import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 8000,
  jwtKey: process.env.JWT_KEY,
  mongoUrl: process.env.MONGO_URL,
  rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://localhost:5672",
};
