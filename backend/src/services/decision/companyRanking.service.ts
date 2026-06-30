import { DecisionScoreInput } from "../../types/decision.types";

export const calculateCompanyScore = (input: DecisionScoreInput) => {
  let score = 50;

  if (input.companyIsHiring) {
    score += 25;
  }

  if (input.hasCompanyCareerUrl) {
    score += 10;
  }

  if (
    input.companyAverageResponseDays !== undefined &&
    input.companyAverageResponseDays <= 7
  ) {
    score += 15;
  }

  if (
    input.companyAverageResponseDays !== undefined &&
    input.companyAverageResponseDays > 21
  ) {
    score -= 15;
  }

  return clamp(score);
};

export const calculateReferralProbability = (input: DecisionScoreInput) => {
  let probability = input.referralEnabled ? 45 : 20;

  if (input.companyIsHiring) {
    probability += 15;
  }

  if (input.hasCompanyCareerUrl) {
    probability += 10;
  }

  if (
    input.companyAverageResponseDays !== undefined &&
    input.companyAverageResponseDays <= 10
  ) {
    probability += 10;
  }

  return clamp(probability);
};

const clamp = (score: number): number => {
  return Math.max(0, Math.min(Math.round(score), 100));
};
