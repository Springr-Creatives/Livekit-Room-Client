import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import apiRouter from "./routes/api";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Force JSON responses for every request
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.type("application/json");
  next();
});

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

// mount all API routes under the /api prefix
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const payload: Record<string, any> = {
    success: false,
    message: err.message || "Internal Server Error",
    status,
  };

  if (req.app.get("env") === "development" && err.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
});

export default app;
