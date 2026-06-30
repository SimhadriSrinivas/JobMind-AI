import { OpportunityProvider } from "./provider.interface";
import { CompanyCareerProvider } from "../providers/companyCareer.provider";
import { FounditProvider } from "../providers/foundit.provider";
import { InternshalaProvider } from "../providers/internshala.provider";
import { LinkedInProvider } from "../providers/linkedin.provider";
import { NaukriProvider } from "../providers/naukri.provider";
import { WellfoundProvider } from "../providers/wellfound.provider";

const providers: OpportunityProvider[] = [
  new LinkedInProvider(),
  new NaukriProvider(),
  new FounditProvider(),
  new InternshalaProvider(),
  new WellfoundProvider(),
  new CompanyCareerProvider(),
];

export const getOpportunityProviders = (): OpportunityProvider[] => {
  return providers;
};

export const getProviderStatuses = async () => {
  return Promise.all(providers.map((provider) => provider.healthCheck()));
};
