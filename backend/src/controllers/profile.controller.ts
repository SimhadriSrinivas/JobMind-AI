import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { createProfile } from "../services/profile/createProfile.service";
import { deleteProfile } from "../services/profile/deleteProfile.service";
import { getProfile } from "../services/profile/getProfile.service";
import { updateProfile } from "../services/profile/updateProfile.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createMyProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const profile = await createProfile(getUserId(req), req.body);

    res
      .status(201)
      .json(new ApiResponse(201, { profile }, "Career profile created successfully"));
  }
);

export const getMyProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const profile = await getProfile(getUserId(req));

    res
      .status(200)
      .json(new ApiResponse(200, { profile }, "Career profile fetched successfully"));
  }
);

export const updateMyProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const profile = await updateProfile(getUserId(req), req.body);

    res
      .status(200)
      .json(new ApiResponse(200, { profile }, "Career profile updated successfully"));
  }
);

export const deleteMyProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await deleteProfile(getUserId(req));

    res
      .status(200)
      .json(new ApiResponse(200, result, "Career profile deleted successfully"));
  }
);

const getUserId = (req: AuthenticatedRequest): string => {
  const userId = req.user?._id?.toString();

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  return userId;
};
