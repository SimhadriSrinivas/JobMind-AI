import { CampaignExecutionPlan } from "../../types/campaign.types";
import { getCampaign } from "./getCampaign.service";

export const getCampaignExecutionPlan = async (
  userId: string,
  campaignId: string
): Promise<CampaignExecutionPlan> => {
  const campaign = await getCampaign(userId, campaignId);
  const nextRecommendedActions: string[] = [];

  if (campaign.status === "DRAFT") {
    nextRecommendedActions.push("Activate campaign");
  }

  if (campaign.resumeStrategy.type === "AI_RESUME_VERSION") {
    nextRecommendedActions.push("Generate AI resume version per matched opportunity");
  }

  if (campaign.referral.enabled) {
    nextRecommendedActions.push("Prioritize referral discovery before application creation");
  }

  if (campaign.coverLetter.enabled) {
    nextRecommendedActions.push("Prepare cover letter according to campaign strategy");
  }

  return {
    campaignId: campaign._id,
    status: campaign.status,
    searchCriteria: {
      opportunityTypes: campaign.opportunityTypes,
      locations: campaign.locations,
      remote: campaign.remote,
      salary: campaign.salary,
      experience: campaign.experience,
      skills: campaign.skills,
      excludedSkills: campaign.excludedSkills,
      companies: campaign.companies,
    },
    resumeStrategy: campaign.resumeStrategy,
    referralStrategy: campaign.referral,
    notificationStrategy: campaign.notifications,
    dailyLimit: campaign.applicationLimit.daily,
    nextRecommendedActions,
  };
};
