import { Opportunity } from "../../../types/opportunity.types";
import { OpportunityProvider } from "./provider.interface";

export const normalizeProviderResults = async (
  provider: OpportunityProvider,
  rawResults: unknown[]
): Promise<Opportunity[]> => {
  return rawResults.map((rawResult) => provider.normalize(rawResult));
};
