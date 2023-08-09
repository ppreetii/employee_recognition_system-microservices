import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 4000,
  mongoUrl: process.env.MONGO_URL,
  jwtKey: process.env.JWT_KEY,
};