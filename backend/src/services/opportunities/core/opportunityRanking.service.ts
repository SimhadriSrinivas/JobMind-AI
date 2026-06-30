import {
  Opportunity,
  OpportunitySearchQuery,
} from "../../../types/opportunity.types";

export const rankOpportunities = (
  opportunities: Opportunity[],
  query: OpportunitySearchQuery
): Opportunity[] => {
  return [...opportunities].sort((first, second) => {
    return scoreOpportunity(second, query) - scoreOpportunity(first, query);
  });
};

const scoreOpportunity = (
  opportunity: Opportunity,
  query: OpportunitySearchQuery
): number => {
  let score = 0;

  if (
    query.keyword &&
    `${opportunity.title} ${opportunity.description || ""}`
      .toLowerCase()
      .includes(query.keyword.toLowerCase())
  ) {
    score += 30;
  }

  if (
    query.location &&
    opportunity.location?.toLowerCase().includes(query.location.toLowerCase())
  ) {
    score += 20;
  }

  if (query.opportunityType && opportunity.opportunityType === query.opportunityType) {
    score += 20;
  }

  if (query.experience && opportunity.experience !== undefined) {
    score += opportunity.experience <= Number(query.experience) ? 15 : 0;
  }

  if (query.skills) {
    const requestedSkills = query.skills.split(",").map((skill) => {
      return skill.trim().toLowerCase();
    });
    const opportunitySkills = opportunity.skills.map((skill) => skill.toLowerCase());
    score += requestedSkills.filter((skill) => opportunitySkills.includes(skill)).length * 10;
  }

  if (opportunity.isRemote) {
    score += 5;
  }

  return score;
};
