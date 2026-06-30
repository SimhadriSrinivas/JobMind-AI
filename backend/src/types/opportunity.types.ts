export const opportunityTypes = [
  "JOB",
  "INTERNSHIP",
  "PART_TIME",
  "FREELANCE",
  "REMOTE",
  "CONTRACT",
  "CAREER_PAGE",
] as const;

export type OpportunityType = (typeof opportunityTypes)[number];

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location?: string;
  salary?: number;
  currency?: string;
  experience?: number;
  skills: string[];
  description?: string;
  employmentType?: string;
  opportunityType: OpportunityType;
  source: string;
  url?: string;
  postedDate?: Date;
  deadline?: Date;
  isRemote: boolean;
  companyLogo?: string;
  createdAt: Date;
}

export interface OpportunitySearchQuery {
  keyword?: string;
  location?: string;
  experience?: string;
  skills?: string;
  opportunityType?: OpportunityType;
  page?: string;
  limit?: string;
}

export interface ProviderHealth {
  provider: string;
  healthy: boolean;
  message: string;
}
