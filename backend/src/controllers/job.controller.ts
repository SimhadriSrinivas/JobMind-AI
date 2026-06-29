import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { createJob } from "../services/job/createJob.service";
import { deleteJob } from "../services/job/deleteJob.service";
import { getJob } from "../services/job/getJob.service";
import { getJobs } from "../services/job/getJobs.service";
import { matchResumeToJob } from "../services/job/matchResume.service";
import { searchJobs } from "../services/job/searchJobs.service";
import { updateJob } from "../services/job/updateJob.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createJobController = asyncHandler(async (req, res: Response) => {
  const job = await createJob(req.body);

  res.status(201).json(new ApiResponse(201, { job }, "Job created successfully"));
});

export const getJobsController = asyncHandler(async (req, res: Response) => {
  const result = await getJobs(Number(req.query.page), Number(req.query.limit));

  res.status(200).json(new ApiResponse(200, result, "Jobs fetched successfully"));
});

export const getJobController = asyncHandler(async (req, res: Response) => {
  const job = await getJob(getParamId(req, "id"));

  res.status(200).json(new ApiResponse(200, { job }, "Job fetched successfully"));
});

export const updateJobController = asyncHandler(async (req, res: Response) => {
  const job = await updateJob(getParamId(req, "id"), req.body);

  res.status(200).json(new ApiResponse(200, { job }, "Job updated successfully"));
});

export const deleteJobController = asyncHandler(async (req, res: Response) => {
  const result = await deleteJob(getParamId(req, "id"));

  res.status(200).json(new ApiResponse(200, result, "Job deleted successfully"));
});

export const searchJobsController = asyncHandler(async (req, res: Response) => {
  const result = await searchJobs(req.query);

  res.status(200).json(new ApiResponse(200, result, "Jobs search completed"));
});

export const matchResumeController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await matchResumeToJob({
      resumeId: req.body.resumeId,
      jobId: getParamId(req, "id"),
      userId: getUserId(req),
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Resume match calculated successfully"));
  }
);

const getParamId = (req: AuthenticatedRequest, key: string): string => {
  const value = req.params[key];

  if (!value || Array.isArray(value)) {
    throw new ApiError(400, `${key} is required`);
  }

  return value;
};

const getUserId = (req: AuthenticatedRequest): string => {
  const userId = req.user?._id?.toString();

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  return userId;
};
