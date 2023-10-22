import dotenv from 'dotenv';

dotenv.config();

export default {
  rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://localhost:5672",
};