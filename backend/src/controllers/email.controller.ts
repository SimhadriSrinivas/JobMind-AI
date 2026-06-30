import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  classifyEmailInput,
  getEmailEvent,
  getEmailEvents,
  syncEmails,
} from "../services/email/emailSync.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getEmailEventsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await getEmailEvents(getUserId(req), req.query);

    res
      .status(200)
      .json(new ApiResponse(200, result, "Email events fetched successfully"));
  }
);

export const getEmailEventController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const event = await getEmailEvent(getUserId(req), getEventId(req));

    res
      .status(200)
      .json(new ApiResponse(200, { event }, "Email event fetched successfully"));
  }
);

export const syncEmailsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await syncEmails(getUserId(req), req.body);

    res
      .status(200)
      .json(new ApiResponse(200, result, "Email sync completed successfully"));
  }
);

export const classifyEmailController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await classifyEmailInput(getUserId(req), req.body);

    res
      .status(200)
      .json(new ApiResponse(200, result, "Email classified successfully"));
  }
);

const getUserId = (req: AuthenticatedRequest): string => {
  const userId = req.user?._id?.toString();

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  return userId;
};

const getEventId = (req: AuthenticatedRequest): string => {
  const eventId = req.params.id;

  if (!eventId || Array.isArray(eventId)) {
    throw new ApiError(400, "Email event id is required");
  }

  return eventId;
};
