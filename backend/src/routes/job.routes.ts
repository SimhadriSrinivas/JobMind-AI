import { Router } from "express";
import {
  createJobController,
  deleteJobController,
  getJobController,
  getJobsController,
  matchResumeController,
  searchJobsController,
  updateJobController,
} from "../controllers/job.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getJobsController);
router.get("/search", searchJobsController);
router.get("/:id", getJobController);
router.post("/", authMiddleware, createJobController);
router.patch("/:id", authMiddleware, updateJobController);
router.delete("/:id", authMiddleware, deleteJobController);
router.post("/:id/match", authMiddleware, matchResumeController);

export default router;
