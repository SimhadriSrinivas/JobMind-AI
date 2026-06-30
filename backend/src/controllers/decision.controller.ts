import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  analyzeBatchDecision,
  analyzeJobDecision,
  getDecisionRecommendations,
} from "../services/decision/decisionEngine.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const analyzeJobController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const decision = await analyzeJobDecision(getUserId(req), req.body);

    res
      .status(200)
      .json(new ApiResponse(200, { decision }, "Job decision analyzed"));
  }
);

export const analyzeBatchController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const decisions = await analyzeBatchDecision(getUserId(req), req.body);

    res
      .status(200)
      .json(new ApiResponse(200, { decisions }, "Batch decision analyzed"));
  }
);

export const getRecommendationsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const recommendations = await getDecisionRecommendations(
      getUserId(req),
      Number(req.query.limit)
    );

    res
      .status(200)
      .json(new ApiResponse(200, { recommendations }, "Recommendations fetched"));
  }
);

const getUserId = (req: AuthenticatedRequest): string => {
  const userId = req.user?._id?.toString();

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  return userId;
};
