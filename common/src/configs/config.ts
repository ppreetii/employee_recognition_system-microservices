import dotenv from "dotenv";

dotenv.config();

export const config = {
    jwtKey : process.env.JWT_KEY,
    redisHost : process.env.REDIS_HOST || "localhost",
    redisPort : process.env.REDIS_PORT || 6379
}