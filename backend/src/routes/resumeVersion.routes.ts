import { Router } from "express";
import {
  deleteResumeVersionController,
  downloadResumeVersionController,
  generateResumeVersionController,
  getResumeVersionController,
  getResumeVersionsController,
} from "../controllers/resumeVersion.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/generate", generateResumeVersionController);
router.get("/", getResumeVersionsController);
router.get("/:id", getResumeVersionController);
router.delete("/:id", deleteResumeVersionController);
router.get("/:id/download", downloadResumeVersionController);

export default router;
