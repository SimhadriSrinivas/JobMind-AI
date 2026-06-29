import { Types } from "mongoose";

export const applicationStatuses = [
  "SAVED",
  "APPLIED",
  "UNDER_REVIEW",
  "ASSESSMENT",
  "INTERVIEW",
  "HR_ROUND",
  "TECHNICAL_ROUND",
  "FINAL_ROUND",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
] as const;

export const applicationSources = [
  "Manual",
  "LinkedIn",
  "Naukri",
  "Indeed",
  "Internshala",
  "Foundit",
  "Wellfound",
  "Career Page",
  "Referral",
] as const;

export const applicationPriorities = ["HIGH", "MEDIUM", "LOW"] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];
export type ApplicationSource = (typeof applicationSources)[number];
export type ApplicationPriority = (typeof applicationPriorities)[number];

export interface ApplicationTimelineInput {
  title: string;
  description?: string;
  date?: Date | string;
  attachments?: string[];
  metadata?: Record<string, unknown>;
}

export interface ApplicationInput {
  jobId: string | Types.ObjectId;
  resumeId: string | Types.ObjectId;
  resumeVersionId?: string | Types.ObjectId | null;
  coverLetterId?: string | Types.ObjectId | null;
  companyId?: string | Types.ObjectId;
  status?: ApplicationStatus;
  applicationSource?: ApplicationSource;
  appliedDate?: Date | string;
  notes?: string;
  timeline?: ApplicationTimelineInput[];
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterLinkedIn?: string;
  interviewDate?: Date | string;
  interviewMode?: string;
  assessmentLink?: string;
  offerAmount?: number;
  currency?: string;
  expectedSalary?: number;
  currentSalary?: number;
  priority?: ApplicationPriority;
  bookmarked?: boolean;
  archived?: boolean;
  metadata?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
}

export type UpdateApplicationInput = Partial<ApplicationInput>;

export interface UpdateApplicationStatusInput {
  status: ApplicationStatus;
  description?: string;
  attachments?: string[];
}
