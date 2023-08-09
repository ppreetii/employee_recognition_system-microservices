import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler } from "@reward-sys/common";

import { employeeRoutes } from "./routes/v1/employee";
import { API } from "./constants/api";

const app = express();

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(`${API.BASE_URL}${API.EMPLOYEE}`, employeeRoutes);

app.use(errorHandler);
app.all("*", () => {
  throw new NotFoundError();
});

export { app };
