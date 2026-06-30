import {
  DecisionOutput,
  RecommendationLevel,
} from "../../types/decision.types";

export const recommendApplicationAction = (
  decision: Omit<DecisionOutput, "applicationRecommendation">
): RecommendationLevel => {
  if (decision.overallScore >= 78 && decision.missingSkills.length <= 2) {
    return "APPLY_NOW";
  }

  if (decision.resumeMatch < 60 || decision.atsScore < 65) {
    return "APPLY_AFTER_RESUME_UPDATE";
  }

  if (decision.referralProbability >= 55 || decision.companyScore < 60) {
    return "NEED_REFERRAL";
  }

  return "NOT_RECOMMENDED";
};
