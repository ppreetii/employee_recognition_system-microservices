import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler } from "@reward-sys/common";

import { projectRoutes } from "./routes/v1/project";
import { API } from "./constants/api";

const app = express();

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(`${API.BASE_URL}${API.PROJECT}`, projectRoutes);

app.use(errorHandler);
app.all("*", () => {
  throw new NotFoundError();
});

export { app };
