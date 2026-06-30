import { Router } from "express";
import {
  getOpportunityProvidersController,
  searchOpportunitiesController,
} from "../controllers/opportunity.controller";

const router = Router();

router.get("/search", searchOpportunitiesController);
router.get("/providers", getOpportunityProvidersController);

export default router;
