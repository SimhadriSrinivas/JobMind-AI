import { Router } from "express";
import {
  deleteNotificationController,
  getNotificationController,
  getNotificationsController,
  markAllNotificationsReadController,
  markNotificationReadController,
  sendTestNotificationController,
} from "../controllers/notification.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getNotificationsController);
router.patch("/read-all", markAllNotificationsReadController);
router.post("/test", sendTestNotificationController);
router.get("/:id", getNotificationController);
router.patch("/:id/read", markNotificationReadController);
router.delete("/:id", deleteNotificationController);

export default router;
