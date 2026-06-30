import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { activateCampaign, archiveCampaign, pauseCampaign } from "../services/campaign/updateCampaignStatus.service";
import { createCampaign } from "../services/campaign/createCampaign.service";
import { deleteCampaign } from "../services/campaign/deleteCampaign.service";
import { getCampaign } from "../services/campaign/getCampaign.service";
import { getCampaignExecutionPlan } from "../services/campaign/getCampaignExecutionPlan.service";
import { getCampaigns } from "../services/campaign/getCampaigns.service";
import { updateCampaign } from "../services/campaign/updateCampaign.service";
import { validateCampaignReadiness } from "../services/campaign/validateCampaignReadiness.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createCampaignController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const campaign = await createCampaign(getUserId(req), req.body);

    res
      .status(201)
      .json(new ApiResponse(201, { campaign }, "Campaign created successfully"));
  }
);

export const getCampaignsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await getCampaigns(getUserId(req), req.query);

    res
      .status(200)
      .json(new ApiResponse(200, result, "Campaigns fetched successfully"));
  }
);

export const getCampaignController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const campaign = await getCampaign(getUserId(req), getCampaignId(req));

    res
      .status(200)
      .json(new ApiResponse(200, { campaign }, "Campaign fetched successfully"));
  }
);

export const updateCampaignController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const campaign = await updateCampaign(getUserId(req), getCampaignId(req), req.body);

    res
      .status(200)
      .json(new ApiResponse(200, { campaign }, "Campaign updated successfully"));
  }
);

export const deleteCampaignController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await deleteCampaign(getUserId(req), getCampaignId(req));

    res
      .status(200)
      .json(new ApiResponse(200, result, "Campaign deleted successfully"));
  }
);

export const activateCampaignController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const campaign = await activateCampaign(getUserId(req), getCampaignId(req));

    res
      .status(200)
      .json(new ApiResponse(200, { campaign }, "Campaign activated successfully"));
  }
);

export const pauseCampaignController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const campaign = await pauseCampaign(getUserId(req), getCampaignId(req));

    res
      .status(200)
      .json(new ApiResponse(200, { campaign }, "Campaign paused successfully"));
  }
);

export const archiveCampaignController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const campaign = await archiveCampaign(getUserId(req), getCampaignId(req));

    res
      .status(200)
      .json(new ApiResponse(200, { campaign }, "Campaign archived successfully"));
  }
);

export const getCampaignExecutionPlanController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const executionPlan = await getCampaignExecutionPlan(
      getUserId(req),
      getCampaignId(req)
    );

    res
      .status(200)
      .json(new ApiResponse(200, { executionPlan }, "Campaign execution plan fetched"));
  }
);

export const validateCampaignReadinessController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const readiness = await validateCampaignReadiness(getUserId(req), getCampaignId(req));

    res
      .status(200)
      .json(new ApiResponse(200, { readiness }, "Campaign readiness checked"));
  }
);

const getUserId = (req: AuthenticatedRequest): string => {
  const userId = req.user?._id?.toString();

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  return userId;
};

const getCampaignId = (req: AuthenticatedRequest): string => {
  const campaignId = req.params.id;

  if (!campaignId || Array.isArray(campaignId)) {
    throw new ApiError(400, "Campaign id is required");
  }

  return campaignId;
};
