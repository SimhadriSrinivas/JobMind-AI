import { Router } from "express";
import {
  createApplicationController,
  deleteApplicationController,
  getApplicationAnalyticsController,
  getApplicationController,
  getApplicationsController,
  updateApplicationController,
  updateApplicationStatusController,
} from "../controllers/application.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createApplicationController);
router.get("/", getApplicationsController);
router.get("/analytics", getApplicationAnalyticsController);
router.get("/:id", getApplicationController);
router.patch("/:id", updateApplicationController);
router.delete("/:id", deleteApplicationController);
router.patch("/:id/status", updateApplicationStatusController);

export default router;
