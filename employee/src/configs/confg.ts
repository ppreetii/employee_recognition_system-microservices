import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  jwtKey: process.env.JWT_KEY,
  mongoUrl: process.env.MONGO_URL,
};
