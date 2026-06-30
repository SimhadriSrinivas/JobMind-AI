import { getCampaign } from "./getCampaign.service";

export const validateCampaignReadiness = async (
  userId: string,
  campaignId: string
) => {
  const campaign = await getCampaign(userId, campaignId);
  const issues: string[] = [];

  if (!campaign.name.trim()) {
    issues.push("Campaign name is required");
  }

  if (!campaign.opportunityTypes.length) {
    issues.push("At least one opportunity type is required");
  }

  if (campaign.applicationLimit.daily < 1 || campaign.applicationLimit.daily > 100) {
    issues.push("Daily application limit must be between 1 and 100");
  }

  if (
    campaign.salary.min !== undefined &&
    campaign.salary.max !== undefined &&
    campaign.salary.min > campaign.salary.max
  ) {
    issues.push("Salary minimum cannot be greater than maximum");
  }

  if (
    campaign.experience.min !== undefined &&
    campaign.experience.max !== undefined &&
    campaign.experience.min > campaign.experience.max
  ) {
    issues.push("Experience minimum cannot be greater than maximum");
  }

  if (
    campaign.resumeStrategy.type !== "MASTER_RESUME" &&
    !campaign.resumeStrategy.resumeVersionId
  ) {
    issues.push("Resume version is required for selected resume strategy");
  }

  return {
    ready: issues.length === 0,
    issues,
  };
};
