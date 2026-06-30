import { FilterQuery, Types } from "mongoose";
import Application from "../../models/application.model";
import Campaign from "../../models/campaign.model";
import EmailEvent from "../../models/emailEvent.model";
import Notification, { INotification } from "../../models/notification.model";
import {
  NotificationChannel,
  NotificationInput,
  TestNotificationInput,
  notificationChannels,
  notificationSources,
  notificationTypes,
} from "../../types/notification.types";
import { ApiError } from "../../utils/ApiError";
import { filterChannelsByPreference } from "./notificationPreference.service";
import { scheduleNotificationDelivery } from "./notificationScheduler.service";

export const createNotification = async (input: NotificationInput) => {
  await validateNotificationInput(input);

  const userId = input.userId.toString();
  const requestedChannels = normalizeChannels(input.channels);
  const channels = await filterChannelsByPreference(userId, requestedChannels);

  const notification = await Notification.create({
    ...input,
    userId,
    type: input.type || "INFO",
    source: input.source || "SYSTEM",
    channels,
    deliveryStatus: "PENDING",
    isRead: false,
  });

  scheduleNotificationDelivery(notification);

  return notification;
};

export const getNotifications = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const page = parsePositiveNumber(query.page, 1);
  const limit = Math.min(parsePositiveNumber(query.limit, 20), 100);
  const skip = (page - 1) * limit;
  const filter: FilterQuery<INotification> = { userId };

  if (typeof query.isRead === "string") {
    filter.isRead = query.isRead === "true";
  }

  if (typeof query.type === "string") {
    filter.type = query.type;
  }

  if (typeof query.source === "string") {
    filter.source = query.source;
  }

  const [notifications, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getNotification = async (userId: string, notificationId: string) => {
  validateObjectId(notificationId, "Invalid notification id");

  const notification = await Notification.findOne({ _id: notificationId, userId });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return notification;
};

export const markNotificationRead = async (
  userId: string,
  notificationId: string
) => {
  validateObjectId(notificationId, "Invalid notification id");

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    {
      $set: {
        isRead: true,
        deliveryStatus: "READ",
      },
    },
    { new: true, runValidators: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return notification;
};

export const markAllNotificationsRead = async (userId: string) => {
  const result = await Notification.updateMany(
    { userId, isRead: false },
    {
      $set: {
        isRead: true,
        deliveryStatus: "READ",
      },
    }
  );

  return {
    modifiedCount: result.modifiedCount,
  };
};

export const deleteNotification = async (
  userId: string,
  notificationId: string
) => {
  validateObjectId(notificationId, "Invalid notification id");

  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    userId,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return { deleted: true };
};

export const sendTestNotification = async (
  userId: string,
  input: TestNotificationInput
) => {
  return createNotification({
    userId,
    title: input.title || "JobMind AI test notification",
    message: input.message || "Notification engine delivery test",
    type: "INFO",
    source: "SYSTEM",
    channels: input.channels || ["IN_APP", "PUSH", "EMAIL"],
  });
};

const validateNotificationInput = async (
  input: NotificationInput
): Promise<void> => {
  validateObjectId(input.userId.toString(), "Invalid user id");

  if (!input.title?.trim()) {
    throw new ApiError(400, "Notification title is required");
  }

  if (!input.message?.trim()) {
    throw new ApiError(400, "Notification message is required");
  }

  if (input.type && !notificationTypes.includes(input.type)) {
    throw new ApiError(400, "Invalid notification type");
  }

  if (input.source && !notificationSources.includes(input.source)) {
    throw new ApiError(400, "Invalid notification source");
  }

  if (input.channels?.some((channel) => !notificationChannels.includes(channel))) {
    throw new ApiError(400, "Invalid notification channel");
  }

  await validateReference(input.userId.toString(), input.campaignId, Campaign, "Campaign");
  await validateReference(
    input.userId.toString(),
    input.applicationId,
    Application,
    "Application"
  );
  await validateReference(
    input.userId.toString(),
    input.emailEventId,
    EmailEvent,
    "Email event"
  );
};

const validateReference = async (
  userId: string,
  id: string | Types.ObjectId | null | undefined,
  model: typeof Campaign | typeof Application | typeof EmailEvent,
  label: string
): Promise<void> => {
  if (!id) {
    return;
  }

  validateObjectId(id.toString(), `Invalid ${label.toLowerCase()} id`);

  const record = await model.findOne({ _id: id, userId });

  if (!record) {
    throw new ApiError(404, `${label} not found`);
  }
};

const normalizeChannels = (
  channels: NotificationChannel[] | undefined
): NotificationChannel[] => {
  const resolvedChannels = channels?.length ? channels : ["IN_APP"];
  return Array.from(new Set(resolvedChannels));
};

const validateObjectId = (value: string, message: string): void => {
  if (!Types.ObjectId.isValid(value)) {
    throw new ApiError(400, message);
  }
};

const parsePositiveNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
