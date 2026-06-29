import { Types } from "mongoose";
import Application from "../../models/application.model";
import Job from "../../models/job.model";
import Resume from "../../models/resume.model";
import { ApplicationInput } from "../../types/application.types";
import { ApiError } from "../../utils/ApiError";
import { createTimelineItem } from "./applicationTimeline.service";

export const createApplication = async (
  userId: string,
  applicationData: ApplicationInput
) => {
  validateObjectId(applicationData.jobId, "Invalid job id");
  validateObjectId(applicationData.resumeId, "Invalid resume id");

  const [job, resume] = await Promise.all([
    Job.findById(applicationData.jobId),
    Resume.findOne({ _id: applicationData.resumeId, userId }),
  ]);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  const existingApplication = await Application.findOne({
    userId,
    jobId: applicationData.jobId,
  });

  if (existingApplication) {
    throw new ApiError(409, "Application already exists for this job");
  }

  const status = applicationData.status || "SAVED";
  const timeline = [
    createTimelineItem({
      title: "Application Created",
      description: `Application created with ${status} status`,
      date: new Date(),
    }),
    ...(applicationData.timeline || []).map(createTimelineItem),
  ];

  return Application.create({
    ...applicationData,
    userId,
    companyId: applicationData.companyId || job.companyId,
    status,
    appliedDate: applicationData.appliedDate
      ? new Date(applicationData.appliedDate)
      : status === "APPLIED"
        ? new Date()
        : undefined,
    lastUpdated: new Date(),
    timeline,
  });
};

const validateObjectId = (value: unknown, message: string): void => {
  if (!value || !Types.ObjectId.isValid(value.toString())) {
    throw new ApiError(400, message);
  }
};
