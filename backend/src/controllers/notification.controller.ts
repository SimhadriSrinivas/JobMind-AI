import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  deleteNotification,
  getNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  sendTestNotification,
} from "../services/notification/notification.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getNotificationsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await getNotifications(getUserId(req), req.query);

    res
      .status(200)
      .json(new ApiResponse(200, result, "Notifications fetched successfully"));
  }
);

export const getNotificationController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const notification = await getNotification(getUserId(req), getNotificationId(req));

    res
      .status(200)
      .json(new ApiResponse(200, { notification }, "Notification fetched successfully"));
  }
);

export const markNotificationReadController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const notification = await markNotificationRead(
      getUserId(req),
      getNotificationId(req)
    );

    res
      .status(200)
      .json(new ApiResponse(200, { notification }, "Notification marked as read"));
  }
);

export const markAllNotificationsReadController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await markAllNotificationsRead(getUserId(req));

    res
      .status(200)
      .json(new ApiResponse(200, result, "All notifications marked as read"));
  }
);

export const deleteNotificationController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await deleteNotification(getUserId(req), getNotificationId(req));

    res
      .status(200)
      .json(new ApiResponse(200, result, "Notification deleted successfully"));
  }
);

export const sendTestNotificationController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const notification = await sendTestNotification(getUserId(req), req.body);

    res
      .status(201)
      .json(new ApiResponse(201, { notification }, "Test notification queued"));
  }
);

const getUserId = (req: AuthenticatedRequest): string => {
  const userId = req.user?._id?.toString();

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  return userId;
};

const getNotificationId = (req: AuthenticatedRequest): string => {
  const notificationId = req.params.id;

  if (!notificationId || Array.isArray(notificationId)) {
    throw new ApiError(400, "Notification id is required");
  }

  return notificationId;
};
