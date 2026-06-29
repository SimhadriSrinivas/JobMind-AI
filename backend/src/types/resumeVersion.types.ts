import { Types } from "mongoose";

export interface GenerateResumeVersionInput {
  resumeId: string | Types.ObjectId;
  jobId: string | Types.ObjectId;
  applicationId: string | Types.ObjectId;
  versionName?: string;
}

export interface GeneratedResumeJson {
  summary: string;
  skills: string[];
  projects: string[];
  education: string[];
  experience: string[];
  sectionOrder: string[];
  jobTitle: string;
}

export interface ResumeVersionScoringInput {
  resumeSkills: string[];
  jobSkills: string[];
  selectedProjects: string[];
  jobDescription: string;
}

export interface ResumeVersionScore {
  atsScore: number;
  matchPercentage: number;
  missingSkills: string[];
  addedSkills: string[];
  removedSkills: string[];
}
