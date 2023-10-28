import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler } from "@reward-sys/common";

const app = express();

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: false
  })
);


app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
