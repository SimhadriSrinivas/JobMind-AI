import Campaign from "../../models/campaign.model";
import { CampaignStatus } from "../../types/campaign.types";
import { ApiError } from "../../utils/ApiError";
import { validateCampaignReadiness } from "./validateCampaignReadiness.service";
import { validateCampaignId } from "./campaignValidation.service";

export const activateCampaign = async (userId: string, campaignId: string) => {
  await updateStatus(userId, campaignId, "ACTIVE");
};

export const pauseCampaign = async (userId: string, campaignId: string) => {
  return updateStatus(userId, campaignId, "PAUSED");
};

export const archiveCampaign = async (userId: string, campaignId: string) => {
  return updateStatus(userId, campaignId, "ARCHIVED");
};

const updateStatus = async (
  userId: string,
  campaignId: string,
  status: CampaignStatus
) => {
  validateCampaignId(campaignId);

  const campaign = await Campaign.findOne({ _id: campaignId, userId });

  if (!campaign) {
    throw new ApiError(404, "Campaign not found");
  }

  if (campaign.status === "ARCHIVED" && status === "ACTIVE") {
    throw new ApiError(400, "Archived campaigns cannot be activated");
  }

  if (status === "ACTIVE") {
    const readiness = await validateCampaignReadiness(userId, campaignId);

    if (!readiness.ready) {
      throw new ApiError(400, "Campaign is not ready to activate", readiness.issues);
    }
  }

  campaign.status = status;
  return campaign.save();
};
