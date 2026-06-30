import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import applicationRoutes from "./routes/application.routes";
import authRoutes from "./routes/auth.routes";
import campaignRoutes from "./routes/campaign.routes";
import decisionRoutes from "./routes/decision.routes";
import emailRoutes from "./routes/email.routes";
import jobRoutes from "./routes/job.routes";
import notificationRoutes from "./routes/notification.routes";
import opportunityRoutes from "./routes/opportunity.routes";
import profileRoutes from "./routes/profile.routes";
import resumeRoutes from "./routes/resume.routes";
import resumeVersionRoutes from "./routes/resumeVersion.routes";
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
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/resume-versions", resumeVersionRoutes);
app.use("/api/decision", decisionRoutes);
app.use("/api/opportunities", opportunityRoutes);

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
