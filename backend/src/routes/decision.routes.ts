import { Router } from "express";
import {
  analyzeBatchController,
  analyzeJobController,
  getRecommendationsController,
} from "../controllers/decision.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/analyze-job", analyzeJobController);
router.post("/analyze-batch", analyzeBatchController);
router.get("/recommendations", getRecommendationsController);

export default router;
