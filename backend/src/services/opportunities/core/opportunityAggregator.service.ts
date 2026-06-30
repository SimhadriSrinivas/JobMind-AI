import {
  Opportunity,
  OpportunitySearchQuery,
} from "../../../types/opportunity.types";
import { deduplicateOpportunities } from "./opportunityDeduplicator.service";
import { normalizeProviderResults } from "./opportunityNormalizer.service";
import { rankOpportunities } from "./opportunityRanking.service";
import { getOpportunityProviders } from "./providerRegistry";

export const searchOpportunities = async (query: OpportunitySearchQuery) => {
  const providers = getOpportunityProviders();
  const providerResults = await Promise.all(
    providers.map(async (provider) => {
      const rawResults = await provider.search(query);
      return normalizeProviderResults(provider, rawResults);
    })
  );
  const merged = providerResults.flat();
  const filtered = applyFilters(merged, query);
  const deduplicated = deduplicateOpportunities(filtered);
  const ranked = rankOpportunities(deduplicated, query);
  const page = parsePositiveNumber(query.page, 1);
  const limit = Math.min(parsePositiveNumber(query.limit, 20), 100);
  const start = (page - 1) * limit;

  return {
    opportunities: ranked.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: ranked.length,
      pages: Math.ceil(ranked.length / limit),
    },
    providers: providers.map((provider) => provider.name),
  };
};

const applyFilters = (
  opportunities: Opportunity[],
  query: OpportunitySearchQuery
): Opportunity[] => {
  return opportunities.filter((opportunity) => {
    if (
      query.keyword &&
      !`${opportunity.title} ${opportunity.description || ""} ${opportunity.company}`
        .toLowerCase()
        .includes(query.keyword.toLowerCase())
    ) {
      return false;
    }

    if (
      query.location &&
      !opportunity.location?.toLowerCase().includes(query.location.toLowerCase())
    ) {
      return false;
    }

    if (query.opportunityType && opportunity.opportunityType !== query.opportunityType) {
      return false;
    }

    if (
      query.experience &&
      opportunity.experience !== undefined &&
      opportunity.experience > Number(query.experience)
    ) {
      return false;
    }

    if (query.skills) {
      const requestedSkills = query.skills.split(",").map((skill) => {
        return skill.trim().toLowerCase();
      });
      const opportunitySkills = opportunity.skills.map((skill) => skill.toLowerCase());

      if (!requestedSkills.some((skill) => opportunitySkills.includes(skill))) {
        return false;
      }
    }

    return true;
  });
};

const parsePositiveNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
