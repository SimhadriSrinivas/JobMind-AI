import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { getApplicationAnalytics } from "../services/application/applicationAnalytics.service";
import { createApplication } from "../services/application/createApplication.service";
import { deleteApplication } from "../services/application/deleteApplication.service";
import { getApplication } from "../services/application/getApplication.service";
import { getApplications } from "../services/application/getApplications.service";
import { updateApplication } from "../services/application/updateApplication.service";
import { updateApplicationStatus } from "../services/application/updateApplicationStatus.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createApplicationController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const application = await createApplication(getUserId(req), req.body);

    res
      .status(201)
      .json(new ApiResponse(201, { application }, "Application created successfully"));
  }
);

export const getApplicationsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await getApplications(getUserId(req), req.query);

    res
      .status(200)
      .json(new ApiResponse(200, result, "Applications fetched successfully"));
  }
);

export const getApplicationController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const application = await getApplication(getUserId(req), getApplicationId(req));

    res
      .status(200)
      .json(new ApiResponse(200, { application }, "Application fetched successfully"));
  }
);

export const updateApplicationController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const application = await updateApplication(
      getUserId(req),
      getApplicationId(req),
      req.body
    );

    res
      .status(200)
      .json(new ApiResponse(200, { application }, "Application updated successfully"));
  }
);

export const deleteApplicationController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await deleteApplication(getUserId(req), getApplicationId(req));

    res
      .status(200)
      .json(new ApiResponse(200, result, "Application deleted successfully"));
  }
);

export const updateApplicationStatusController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const application = await updateApplicationStatus(
      getUserId(req),
      getApplicationId(req),
      req.body
    );

    res
      .status(200)
      .json(new ApiResponse(200, { application }, "Application status updated"));
  }
);

export const getApplicationAnalyticsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const analytics = await getApplicationAnalytics(getUserId(req));

    res
      .status(200)
      .json(new ApiResponse(200, { analytics }, "Application analytics fetched"));
  }
);

const getUserId = (req: AuthenticatedRequest): string => {
  const userId = req.user?._id?.toString();

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  return userId;
};

const getApplicationId = (req: AuthenticatedRequest): string => {
  const applicationId = req.params.id;

  if (!applicationId || Array.isArray(applicationId)) {
    throw new ApiError(400, "Application id is required");
  }

  return applicationId;
};
