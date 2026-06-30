import { Types } from "mongoose";
import Company from "../../models/company.model";
import Job from "../../models/job.model";
import Profile from "../../models/profile.model";
import Resume from "../../models/resume.model";
import ResumeVersion from "../../models/resumeVersion.model";
import {
  AnalyzeBatchInput,
  AnalyzeJobInput,
  DecisionOutput,
  DecisionScoreInput,
} from "../../types/decision.types";
import { ApiError } from "../../utils/ApiError";
import {
  calculateCompanyScore,
  calculateReferralProbability,
} from "./companyRanking.service";
import {
  calculateExperienceMatch,
  calculateLocationMatch,
  calculateRemoteMatch,
  calculateResumeMatch,
  getMissingSkills,
} from "./jobRanking.service";
import { recommendApplicationAction } from "./applicationRecommendation.service";
import { calculateSalaryScore } from "./salaryRanking.service";

export const analyzeJobDecision = async (
  userId: string,
  input: AnalyzeJobInput
): Promise<DecisionOutput> => {
  validateObjectId(input.jobId, "Invalid job id");

  const [profile, job] = await Promise.all([
    Profile.findOne({ userId }),
    Job.findById(input.jobId),
  ]);

  if (!profile) {
    throw new ApiError(404, "Career profile not found");
  }

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const [company, resume, resumeVersion] = await Promise.all([
    Company.findById(job.companyId),
    resolveResume(userId, input.resumeId, profile.documents?.resumeId?.toString()),
    resolveResumeVersion(userId, input.resumeVersionId, input.jobId),
  ]);

  const resumeSkills = resumeVersion?.generatedSkills || resume.skills;
  const atsScore = resumeVersion?.atsScore ?? calculateResumeMatch({
    profileExperienceYears: profile.career?.experienceYears,
    resumeSkills,
    jobTitle: job.title,
    jobDescription: job.description,
    jobSkills: job.skills,
  });
  const scoreInput: DecisionScoreInput = {
    profileExperienceYears: profile.career?.experienceYears,
    profileExpectedSalary: profile.career?.expectedSalary,
    preferredLocations: profile.career?.preferredLocations || [],
    remotePreference: profile.career?.remotePreference,
    resumeSkills,
    resumeVersionAtsScore: resumeVersion?.atsScore,
    resumeVersionMatchPercentage: resumeVersion?.matchPercentage,
    jobTitle: job.title,
    jobDescription: job.description,
    jobSkills: job.skills,
    jobExperience: job.experience,
    jobSalary: job.salary,
    jobLocation: job.location,
    isRemote: job.isRemote,
    companyIsHiring: company?.isHiring,
    companyAverageResponseDays: company?.averageResponseDays,
    hasCompanyCareerUrl: Boolean(company?.careersUrl),
    referralEnabled: profile.preferences?.referralEnabled,
  };
  const resumeMatch = calculateResumeMatch(scoreInput);
  const salaryScore = calculateSalaryScore(scoreInput);
  const experienceMatch = calculateExperienceMatch(scoreInput);
  const locationMatch = calculateLocationMatch(scoreInput);
  const remoteMatch = calculateRemoteMatch(scoreInput);
  const companyScore = calculateCompanyScore(scoreInput);
  const referralProbability = calculateReferralProbability(scoreInput);
  const missingSkills = resumeVersion?.missingSkills || getMissingSkills(resumeSkills, job.skills);
  const overallScore = calculateOverallScore({
    resumeMatch,
    atsScore,
    salaryScore,
    experienceMatch,
    locationMatch,
    remoteMatch,
    companyScore,
  });
  const decisionWithoutRecommendation = {
    jobId: job._id.toString(),
    companyId: company?._id.toString(),
    overallScore,
    resumeMatch,
    atsScore,
    salaryScore,
    experienceMatch,
    locationMatch,
    remoteMatch,
    companyScore,
    referralProbability,
    reasons: buildReasons({
      resumeMatch,
      atsScore,
      salaryScore,
      experienceMatch,
      locationMatch,
      remoteMatch,
      companyScore,
      missingSkills,
    }),
    missingSkills,
  };

  return {
    ...decisionWithoutRecommendation,
    applicationRecommendation: recommendApplicationAction(decisionWithoutRecommendation),
  };
};

export const analyzeBatchDecision = async (
  userId: string,
  input: AnalyzeBatchInput
) => {
  if (!Array.isArray(input.jobIds) || input.jobIds.length === 0) {
    throw new ApiError(400, "Job ids are required");
  }

  const decisions = await Promise.all(
    input.jobIds.map((jobId) => {
      return analyzeJobDecision(userId, {
        jobId,
        resumeId: input.resumeId,
      });
    })
  );

  return decisions.sort((first, second) => second.overallScore - first.overallScore);
};

export const getDecisionRecommendations = async (userId: string, limit = 10) => {
  const jobs = await Job.find({ isActive: true })
    .sort({ postedDate: -1, createdAt: -1 })
    .limit(Math.min(Math.max(limit, 1), 50));
  const decisions = await analyzeBatchDecision(userId, {
    jobIds: jobs.map((job) => job._id.toString()),
  });

  return decisions.filter((decision) => {
    return decision.applicationRecommendation !== "NOT_RECOMMENDED";
  });
};

const resolveResume = async (
  userId: string,
  resumeId?: string,
  profileResumeId?: string
) => {
  const resolvedResumeId = resumeId || profileResumeId;

  if (!resolvedResumeId) {
    throw new ApiError(404, "Master resume not found");
  }

  validateObjectId(resolvedResumeId, "Invalid resume id");

  const resume = await Resume.findOne({ _id: resolvedResumeId, userId });

  if (!resume) {
    throw new ApiError(404, "Master resume not found");
  }

  return resume;
};

const resolveResumeVersion = async (
  userId: string,
  resumeVersionId: string | undefined,
  jobId: string
) => {
  if (resumeVersionId) {
    validateObjectId(resumeVersionId, "Invalid resume version id");
    return ResumeVersion.findOne({ _id: resumeVersionId, userId, jobId });
  }

  return ResumeVersion.findOne({ userId, jobId, isActive: true }).sort({
    createdAt: -1,
  });
};

const calculateOverallScore = (scores: {
  resumeMatch: number;
  atsScore: number;
  salaryScore: number;
  experienceMatch: number;
  locationMatch: number;
  remoteMatch: number;
  companyScore: number;
}) => {
  return Math.round(
    scores.resumeMatch * 0.24 +
      scores.atsScore * 0.2 +
      scores.salaryScore * 0.12 +
      scores.experienceMatch * 0.14 +
      scores.locationMatch * 0.1 +
      scores.remoteMatch * 0.08 +
      scores.companyScore * 0.12
  );
};

const buildReasons = (input: {
  resumeMatch: number;
  atsScore: number;
  salaryScore: number;
  experienceMatch: number;
  locationMatch: number;
  remoteMatch: number;
  companyScore: number;
  missingSkills: string[];
}) => {
  const reasons: string[] = [];

  if (input.resumeMatch >= 75) {
    reasons.push("Resume skills strongly match the job requirements");
  }

  if (input.atsScore >= 75) {
    reasons.push("ATS score is strong for this opportunity");
  }

  if (input.salaryScore >= 85) {
    reasons.push("Salary aligns with expectations");
  }

  if (input.experienceMatch >= 80) {
    reasons.push("Experience level is aligned with the role");
  }

  if (input.locationMatch >= 80 || input.remoteMatch >= 85) {
    reasons.push("Location or remote preference is favorable");
  }

  if (input.companyScore >= 75) {
    reasons.push("Company signals indicate a good application opportunity");
  }

  if (input.missingSkills.length > 0) {
    reasons.push(`Missing skills: ${input.missingSkills.slice(0, 5).join(", ")}`);
  }

  return reasons;
};

const validateObjectId = (value: string, message: string): void => {
  if (!Types.ObjectId.isValid(value)) {
    throw new ApiError(400, message);
  }
};
