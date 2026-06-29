import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { deleteResumeVersion } from "../services/resumeVersion/deleteResumeVersion.service";
import { downloadResumeVersion } from "../services/resumeVersion/downloadResumeVersion.service";
import { generateResumeVersion } from "../services/resumeVersion/generateResumeVersion.service";
import { getResumeVersion } from "../services/resumeVersion/getResumeVersion.service";
import { getResumeVersions } from "../services/resumeVersion/getResumeVersions.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const generateResumeVersionController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const resumeVersion = await generateResumeVersion(getUserId(req), req.body);

    res
      .status(201)
      .json(new ApiResponse(201, { resumeVersion }, "Resume version generated"));
  }
);

export const getResumeVersionsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await getResumeVersions(getUserId(req), req.query);

    res
      .status(200)
      .json(new ApiResponse(200, result, "Resume versions fetched"));
  }
);

export const getResumeVersionController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const resumeVersion = await getResumeVersion(getUserId(req), getResumeVersionId(req));

    res
      .status(200)
      .json(new ApiResponse(200, { resumeVersion }, "Resume version fetched"));
  }
);

export const deleteResumeVersionController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await deleteResumeVersion(getUserId(req), getResumeVersionId(req));

    res
      .status(200)
      .json(new ApiResponse(200, result, "Resume version deleted"));
  }
);

export const downloadResumeVersionController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const file = await downloadResumeVersion(getUserId(req), getResumeVersionId(req));

    res.download(file.filePath, file.fileName);
  }
);

const getUserId = (req: AuthenticatedRequest): string => {
  const userId = req.user?._id?.toString();

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  return userId;
};

const getResumeVersionId = (req: AuthenticatedRequest): string => {
  const resumeVersionId = req.params.id;

  if (!resumeVersionId || Array.isArray(resumeVersionId)) {
    throw new ApiError(400, "Resume version id is required");
  }

  return resumeVersionId;
};
