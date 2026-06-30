import { DecisionScoreInput } from "../../types/decision.types";

export const calculateSalaryScore = (input: DecisionScoreInput) => {
  if (!input.profileExpectedSalary || !input.jobSalary) {
    return 65;
  }

  if (input.jobSalary >= input.profileExpectedSalary) {
    return 100;
  }

  const ratio = input.jobSalary / input.profileExpectedSalary;
  return Math.max(20, Math.round(ratio * 100));
};
