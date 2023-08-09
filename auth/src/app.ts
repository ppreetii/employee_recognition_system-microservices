import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler } from "@reward-sys/common";

import { API } from "./constants/api";
import { authRoutes } from "./routes/v1/auth";

const app = express();

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: false
  })
);

app.use(`${API.BASE_URL}${API.AUTH}`, authRoutes);
app.use(errorHandler);
app.all("*", () => {
  throw new NotFoundError();
});


export { app };
