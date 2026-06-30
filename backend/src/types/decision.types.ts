export const recommendationLevels = [
  "APPLY_NOW",
  "APPLY_AFTER_RESUME_UPDATE",
  "NEED_REFERRAL",
  "NOT_RECOMMENDED",
] as const;

export type RecommendationLevel = (typeof recommendationLevels)[number];

export interface AnalyzeJobInput {
  jobId: string;
  resumeId?: string;
  resumeVersionId?: string;
}

export interface AnalyzeBatchInput {
  jobIds: string[];
  resumeId?: string;
}

export interface DecisionScoreInput {
  profileExperienceYears?: number;
  profileExpectedSalary?: number;
  preferredLocations?: string[];
  remotePreference?: string;
  resumeSkills: string[];
  resumeVersionAtsScore?: number;
  resumeVersionMatchPercentage?: number;
  jobTitle: string;
  jobDescription: string;
  jobSkills: string[];
  jobExperience?: number;
  jobSalary?: number;
  jobLocation?: string;
  isRemote?: boolean;
  companyIsHiring?: boolean;
  companyAverageResponseDays?: number;
  hasCompanyCareerUrl?: boolean;
  referralEnabled?: boolean;
}

export interface DecisionOutput {
  jobId: string;
  companyId?: string;
  overallScore: number;
  resumeMatch: number;
  atsScore: number;
  salaryScore: number;
  experienceMatch: number;
  locationMatch: number;
  remoteMatch: number;
  companyScore: number;
  referralProbability: number;
  applicationRecommendation: RecommendationLevel;
  reasons: string[];
  missingSkills: string[];
}
