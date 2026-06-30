import Campaign from "../../models/campaign.model";
import { ApiError } from "../../utils/ApiError";
import { validateCampaignId } from "./campaignValidation.service";

export const deleteCampaign = async (userId: string, campaignId: string) => {
  validateCampaignId(campaignId);

  const campaign = await Campaign.findOneAndDelete({ _id: campaignId, userId });

  if (!campaign) {
    throw new ApiError(404, "Campaign not found");
  }

  return { deleted: true };
};
