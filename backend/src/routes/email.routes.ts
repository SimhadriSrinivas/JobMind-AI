import { Router } from "express";
import {
  classifyEmailController,
  getEmailEventController,
  getEmailEventsController,
  syncEmailsController,
} from "../controllers/email.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/events", getEmailEventsController);
router.get("/events/:id", getEmailEventController);
router.post("/sync", syncEmailsController);
router.post("/classify", classifyEmailController);

export default router;
