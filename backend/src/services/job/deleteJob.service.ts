import { Types } from "mongoose";
import Job from "../../models/job.model";
import { ApiError } from "../../utils/ApiError";

export const deleteJob = async (jobId: string) => {
  if (!Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid job id");
  }

  const job = await Job.findByIdAndDelete(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return { id: job._id.toString() };
};
