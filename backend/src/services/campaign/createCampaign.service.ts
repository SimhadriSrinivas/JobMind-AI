import Campaign from "../../models/campaign.model";
import { CampaignInput } from "../../types/campaign.types";
import { validateCampaignInput } from "./campaignValidation.service";

export const createCampaign = async (userId: string, campaignData: CampaignInput) => {
  await validateCampaignInput(userId, campaignData);

  return Campaign.create({
    ...campaignData,
    name: campaignData.name.trim(),
    userId,
    status: campaignData.status || "DRAFT",
  });
};
