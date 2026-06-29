import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  deleteResume,
  getMyResume,
  replaceResume,
  uploadResume,
} from "../services/resume/uploadResume.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const uploadMyResume = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const resume = await uploadResume(getUserId(req), req.file);

    res
      .status(201)
      .json(new ApiResponse(201, { resume }, "Resume uploaded successfully"));
  }
);

export const getMyMasterResume = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const resume = await getMyResume(getUserId(req));

    res
      .status(200)
      .json(new ApiResponse(200, { resume }, "Resume fetched successfully"));
  }
);

export const deleteMyResume = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await deleteResume(getUserId(req), getResumeId(req));

    res
      .status(200)
      .json(new ApiResponse(200, result, "Resume deleted successfully"));
  }
);

export const replaceMyResume = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const resume = await replaceResume(getUserId(req), getResumeId(req), req.file);

    res
      .status(200)
      .json(new ApiResponse(200, { resume }, "Resume replaced successfully"));
  }
);

const getUserId = (req: AuthenticatedRequest): string => {
  const userId = req.user?._id?.toString();

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  return userId;
};

const getResumeId = (req: AuthenticatedRequest): string => {
  const resumeId = req.params.id;

  if (!resumeId || Array.isArray(resumeId)) {
    throw new ApiError(400, "Resume id is required");
  }

  return resumeId;
};
