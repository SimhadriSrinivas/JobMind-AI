import { Types } from "mongoose";

export interface CompanyInput {
  companyName: string;
  website?: string;
  careersUrl?: string;
  linkedIn?: string;
  glassdoor?: string;
  industry?: string;
  size?: string;
  headquarters?: string;
  logo?: string;
  isHiring?: boolean;
  averageResponseDays?: number;
}

export interface JobInput {
  companyId?: string | Types.ObjectId;
  company?: CompanyInput;
  title: string;
  description: string;
  location?: string;
  employmentType?: string;
  experience?: number;
  salary?: number;
  currency?: string;
  skills?: string[];
  responsibilities?: string[];
  qualifications?: string[];
  benefits?: string[];
  applicationUrl?: string;
  source?: string;
  postedDate?: Date | string;
  deadline?: Date | string;
  isRemote?: boolean;
  isActive?: boolean;
}

export type UpdateJobInput = Partial<JobInput>;

export interface JobSearchQuery {
  keyword?: string;
  location?: string;
  experience?: string;
  remote?: string;
  employmentType?: string;
  skills?: string;
  company?: string;
  salary?: string;
  page?: string;
  limit?: string;
}

export interface ResumeMatchInput {
  resumeId: string;
  jobId: string;
  userId?: string;
}
