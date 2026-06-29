import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { loginUser } from "../services/auth/login.service";
import { registerUser } from "../services/auth/register.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(async (req, res: Response) => {
  const result = await registerUser(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, result, "User registered successfully"));
});

export const login = asyncHandler(async (req, res: Response) => {
  const result = await loginUser(req.body);

  res
    .status(200)
    .json(new ApiResponse(200, result, "User logged in successfully"));
});

export const getMe = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    res
      .status(200)
      .json(new ApiResponse(200, { user: req.user }, "User fetched successfully"));
  }
);
