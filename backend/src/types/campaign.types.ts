import { Types } from "mongoose";
import { OpportunityType } from "./opportunity.types";

export const campaignStatuses = [
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "ARCHIVED",
] as const;

export const resumeStrategyTypes = [
  "MASTER_RESUME",
  "AI_RESUME_VERSION",
  "MANUAL_RESUME",
] as const;

export const coverLetterStrategies = ["AI_GENERATED", "TEMPLATE", "NONE"] as const;
export const referralPriorities = ["LOW", "MEDIUM", "HIGH"] as const;
export const scheduleFrequencies = ["DAILY", "WEEKLY", "MANUAL"] as const;
export const remoteTypes = ["REMOTE", "HYBRID", "ONSITE", "ANY"] as const;
export const salaryPeriods = ["YEARLY", "MONTHLY", "HOURLY"] as const;
export const salaryCurrencies = ["INR", "USD"] as const;

export type CampaignStatus = (typeof campaignStatuses)[number];
export type ResumeStrategyType = (typeof resumeStrategyTypes)[number];
export type CoverLetterStrategy = (typeof coverLetterStrategies)[number];
export type ReferralPriority = (typeof referralPriorities)[number];
export type ScheduleFrequency = (typeof scheduleFrequencies)[number];
export type RemoteType = (typeof remoteTypes)[number];
export type SalaryPeriod = (typeof salaryPeriods)[number];
export type SalaryCurrency = (typeof salaryCurrencies)[number];

export interface CampaignInput {
  name: string;
  description?: string;
  opportunityTypes: OpportunityType[];
  locations?: string[];
  remote?: {
    enabled?: boolean;
    type?: RemoteType;
  };
  salary?: {
    min?: number;
    max?: number;
    currency?: SalaryCurrency;
    period?: SalaryPeriod;
  };
  experience?: {
    min?: number;
    max?: number;
  };
  skills?: string[];
  excludedSkills?: string[];
  companies?: {
    preferred?: string[];
    excluded?: string[];
  };
  referral?: {
    enabled?: boolean;
    priority?: ReferralPriority;
  };
  resumeStrategy?: {
    type?: ResumeStrategyType;
    resumeVersionId?: string | Types.ObjectId | null;
  };
  coverLetter?: {
    enabled?: boolean;
    strategy?: CoverLetterStrategy;
  };
  applicationLimit?: {
    daily?: number;
    weekly?: number;
  };
  notifications?: {
    mobile?: boolean;
    email?: boolean;
    inApp?: boolean;
  };
  schedule?: {
    enabled?: boolean;
    frequency?: ScheduleFrequency;
    timezone?: string;
    preferredRunTime?: string;
  };
  status?: CampaignStatus;
}

export type UpdateCampaignInput = Partial<CampaignInput>;

export interface CampaignExecutionPlan {
  campaignId: Types.ObjectId;
  status: CampaignStatus;
  searchCriteria: {
    opportunityTypes: OpportunityType[];
    locations: string[];
    remote: {
      enabled: boolean;
      type: RemoteType;
    };
    salary: {
      min?: number;
      max?: number;
      currency: SalaryCurrency;
      period: SalaryPeriod;
    };
    experience: {
      min?: number;
      max?: number;
    };
    skills: string[];
    excludedSkills: string[];
    companies: {
      preferred: string[];
      excluded: string[];
    };
  };
  resumeStrategy: {
    type: ResumeStrategyType;
    resumeVersionId?: Types.ObjectId | null;
  };
  referralStrategy: {
    enabled: boolean;
    priority: ReferralPriority;
  };
  notificationStrategy: {
    mobile: boolean;
    email: boolean;
    inApp: boolean;
  };
  dailyLimit: number;
  nextRecommendedActions: string[];
}
