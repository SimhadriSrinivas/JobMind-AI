import { Types } from "mongoose";
import Job from "../../models/job.model";
import { UpdateJobInput } from "../../types/job.types";
import { ApiError } from "../../utils/ApiError";

export const updateJob = async (jobId: string, jobData: UpdateJobInput) => {
  if (!Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid job id");
  }

  if (!jobData || Object.keys(jobData).length === 0) {
    throw new ApiError(400, "Job update data is required");
  }

  const updatePayload = normalizeUpdatePayload(jobData);
  const job = await Job.findByIdAndUpdate(
    jobId,
    { $set: updatePayload },
    {
      new: true,
      runValidators: true,
    }
  ).populate("companyId");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return job;
};

const normalizeUpdatePayload = (jobData: UpdateJobInput) => {
  const { company, companyId, ...payload } = jobData;
  const updatePayload: Record<string, unknown> = { ...payload };

  if (companyId) {
    const normalizedCompanyId = companyId.toString();

    if (!Types.ObjectId.isValid(normalizedCompanyId)) {
      throw new ApiError(400, "Invalid company id");
    }

    updatePayload.companyId = normalizedCompanyId;
  }

  ["skills", "responsibilities", "qualifications", "benefits"].forEach((key) => {
    const value = updatePayload[key];

    if (Array.isArray(value)) {
      updatePayload[key] = Array.from(
        new Set(value.map((item) => String(item).trim()).filter(Boolean))
      );
    }
  });

  return updatePayload;
};
