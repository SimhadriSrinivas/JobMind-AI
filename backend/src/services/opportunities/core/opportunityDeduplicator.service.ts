import { Opportunity } from "../../../types/opportunity.types";

export const deduplicateOpportunities = (
  opportunities: Opportunity[]
): Opportunity[] => {
  const seen = new Map<string, Opportunity>();

  opportunities.forEach((opportunity) => {
    const key = [
      opportunity.title.toLowerCase(),
      opportunity.company.toLowerCase(),
      opportunity.location?.toLowerCase() || "",
    ].join("|");

    if (!seen.has(key)) {
      seen.set(key, opportunity);
    }
  });

  return Array.from(seen.values());
};
