import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler } from "@reward-sys/common";

import { API } from "./constants/api";
import {taskRoutes} from "./routes/v1/task";

const app = express();

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: false
  })
);

app.use(`${API.BASE_URL}${API.TASK}`, taskRoutes);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
