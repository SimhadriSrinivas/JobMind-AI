import { Types } from "mongoose";
import Job from "../../models/job.model";
import { ApiError } from "../../utils/ApiError";

export const getJob = async (jobId: string) => {
  if (!Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid job id");
  }

  const job = await Job.findById(jobId).populate("companyId");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return job;
};
