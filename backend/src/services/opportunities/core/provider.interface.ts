import {
  Opportunity,
  OpportunitySearchQuery,
  ProviderHealth,
} from "../../../types/opportunity.types";

export interface OpportunityProvider<RawOpportunity = unknown> {
  readonly name: string;
  search(query: OpportunitySearchQuery): Promise<RawOpportunity[]>;
  normalize(rawOpportunity: RawOpportunity): Opportunity;
  healthCheck(): Promise<ProviderHealth>;
}
