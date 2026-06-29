import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import resumeRoutes from "./routes/resumeRoutes";
import { errorHandler } from "./middleware/error.middleware";

const app: Application = express();

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to JobMind AI API 🚀",
  });
});

app.get("/api/test", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running",
  });
});

app.use("/api/resume", resumeRoutes);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default app;