import Campaign from "../../models/campaign.model";
import { UpdateCampaignInput } from "../../types/campaign.types";
import { ApiError } from "../../utils/ApiError";
import { validateCampaignId, validateCampaignInput } from "./campaignValidation.service";

export const updateCampaign = async (
  userId: string,
  campaignId: string,
  campaignData: UpdateCampaignInput
) => {
  validateCampaignId(campaignId);
  await validateCampaignInput(userId, campaignData, true);

  const existingCampaign = await Campaign.findOne({ _id: campaignId, userId });

  if (!existingCampaign) {
    throw new ApiError(404, "Campaign not found");
  }

  if (existingCampaign.status === "ARCHIVED") {
    throw new ApiError(400, "Archived campaigns cannot be updated");
  }

  const updatePayload = {
    ...campaignData,
    name: campaignData.name?.trim(),
  };

  const campaign = await Campaign.findOneAndUpdate(
    { _id: campaignId, userId },
    { $set: updatePayload },
    { new: true, runValidators: true }
  );

  if (!campaign) {
    throw new ApiError(404, "Campaign not found");
  }

  return campaign;
};
