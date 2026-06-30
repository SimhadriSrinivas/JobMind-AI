import { Router } from "express";
import {
  activateCampaignController,
  archiveCampaignController,
  createCampaignController,
  deleteCampaignController,
  getCampaignController,
  getCampaignExecutionPlanController,
  getCampaignsController,
  pauseCampaignController,
  updateCampaignController,
  validateCampaignReadinessController,
} from "../controllers/campaign.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createCampaignController);
router.get("/", getCampaignsController);
router.get("/:id", getCampaignController);
router.patch("/:id", updateCampaignController);
router.delete("/:id", deleteCampaignController);
router.patch("/:id/activate", activateCampaignController);
router.patch("/:id/pause", pauseCampaignController);
router.patch("/:id/archive", archiveCampaignController);
router.get("/:id/execution-plan", getCampaignExecutionPlanController);
router.get("/:id/readiness", validateCampaignReadinessController);

export default router;
