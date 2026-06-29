import { Types } from "mongoose";
import Job from "../../models/job.model";
import Resume from "../../models/resume.model";
import { ResumeMatchInput } from "../../types/job.types";
import { ApiError } from "../../utils/ApiError";

export const matchResumeToJob = async ({
  resumeId,
  jobId,
  userId,
}: ResumeMatchInput) => {
  if (!Types.ObjectId.isValid(resumeId)) {
    throw new ApiError(400, "Invalid resume id");
  }

  if (!Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid job id");
  }

  const resumeQuery = userId ? { _id: resumeId, userId } : { _id: resumeId };
  const [resume, job] = await Promise.all([
    Resume.findOne(resumeQuery),
    Job.findById(jobId),
  ]);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const resumeSkills = normalizeSkills(resume.skills);
  const jobSkills = normalizeSkills(job.skills);

  if (jobSkills.length === 0) {
    return {
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
      percentage: 0,
    };
  }

  const matchedSkillKeys = jobSkills.filter((skill) => resumeSkills.includes(skill));
  const missingSkillKeys = jobSkills.filter((skill) => !resumeSkills.includes(skill));
  const percentage = Math.round((matchedSkillKeys.length / jobSkills.length) * 100);

  return {
    matchScore: percentage,
    matchedSkills: restoreSkillLabels(matchedSkillKeys, job.skills),
    missingSkills: restoreSkillLabels(missingSkillKeys, job.skills),
    percentage,
  };
};

const normalizeSkills = (skills: string[]): string[] => {
  return Array.from(new Set(skills.map((skill) => skill.trim().toLowerCase()).filter(Boolean)));
};

const restoreSkillLabels = (skillKeys: string[], originalSkills: string[]): string[] => {
  return skillKeys.map((skillKey) => {
    return (
      originalSkills.find((skill) => skill.trim().toLowerCase() === skillKey) || skillKey
    );
  });
};
