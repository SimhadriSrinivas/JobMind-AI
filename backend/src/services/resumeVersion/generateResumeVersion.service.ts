import { Types } from "mongoose";
import Application from "../../models/application.model";
import Job from "../../models/job.model";
import Resume from "../../models/resume.model";
import ResumeVersion from "../../models/resumeVersion.model";
import {
  GenerateResumeVersionInput,
  GeneratedResumeJson,
} from "../../types/resumeVersion.types";
import { ApiError } from "../../utils/ApiError";
import { generateResumePdf } from "./pdfGenerator.service";
import { selectRelevantProjects } from "./projectSelector.service";
import { scoreResumeVersion } from "./resumeScoring.service";
import { orderResumeSections } from "./sectionOrdering.service";
import { selectRelevantSkills } from "./skillSelector.service";

export const generateResumeVersion = async (
  userId: string,
  input: GenerateResumeVersionInput
) => {
  validateObjectId(input.resumeId, "Invalid resume id");
  validateObjectId(input.jobId, "Invalid job id");
  validateObjectId(input.applicationId, "Invalid application id");

  const [masterResume, job, application] = await Promise.all([
    Resume.findOne({ _id: input.resumeId, userId }),
    Job.findById(input.jobId),
    Application.findOne({ _id: input.applicationId, userId }),
  ]);

  if (!masterResume) {
    throw new ApiError(404, "Master resume not found");
  }

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (
    application.resumeId.toString() !== masterResume._id.toString() ||
    application.jobId.toString() !== job._id.toString()
  ) {
    throw new ApiError(400, "Resume, job and application do not match");
  }

  const skillSelection = selectRelevantSkills(
    masterResume.skills,
    job.skills,
    job.description
  );
  const generatedProjects = selectRelevantProjects(
    masterResume.projects,
    job.skills,
    job.description
  );
  const score = scoreResumeVersion({
    resumeSkills: skillSelection.selectedSkills,
    jobSkills: job.skills,
    selectedProjects: generatedProjects,
    jobDescription: job.description,
  });
  const sectionOrder = orderResumeSections(job.description, generatedProjects.length > 0);
  const summary = buildSummary(job.title, skillSelection.selectedSkills);
  const generatedJson: GeneratedResumeJson = {
    summary,
    skills: skillSelection.selectedSkills,
    projects: generatedProjects,
    education: masterResume.education,
    experience: masterResume.experience,
    sectionOrder,
    jobTitle: job.title,
  };
  const generatedPdfPath = await generateResumePdf(generatedJson, userId);

  const resumeVersion = await ResumeVersion.create({
    userId,
    masterResumeId: masterResume._id,
    jobId: job._id,
    applicationId: application._id,
    versionName: input.versionName || `${job.title} Resume`,
    generatedSkills: generatedJson.skills,
    generatedProjects: generatedJson.projects,
    generatedEducation: generatedJson.education,
    generatedExperience: generatedJson.experience,
    atsScore: score.atsScore,
    matchPercentage: score.matchPercentage,
    missingSkills: score.missingSkills,
    addedSkills: skillSelection.addedSkills,
    removedSkills: skillSelection.removedSkills,
    summary,
    generatedPdfPath,
    generatedJson,
  });

  application.resumeVersionId = resumeVersion._id;
  await application.save();

  return resumeVersion;
};

const validateObjectId = (value: unknown, message: string): void => {
  if (!value || !Types.ObjectId.isValid(value.toString())) {
    throw new ApiError(400, message);
  }
};

const buildSummary = (jobTitle: string, skills: string[]): string => {
  const topSkills = skills.slice(0, 6).join(", ");
  return `Targeted resume version for ${jobTitle}, emphasizing ${topSkills || "relevant experience"}.`;
};
