import { Types } from "mongoose";

export const notificationTypes = [
  "INFO",
  "SUCCESS",
  "WARNING",
  "ERROR",
  "INTERVIEW",
  "OFFER",
  "REJECTION",
  "APPLICATION",
  "JOB_MATCH",
] as const;

export const notificationSources = ["EMAIL", "CAMPAIGN", "SYSTEM", "AI"] as const;

export const notificationDeliveryStatuses = [
  "PENDING",
  "SENT",
  "FAILED",
  "READ",
] as const;

export const notificationChannels = ["IN_APP", "PUSH", "EMAIL"] as const;

export type NotificationType = (typeof notificationTypes)[number];
export type NotificationSource = (typeof notificationSources)[number];
export type NotificationDeliveryStatus =
  (typeof notificationDeliveryStatuses)[number];
export type NotificationChannel = (typeof notificationChannels)[number];

export interface NotificationInput {
  userId: string | Types.ObjectId;
  campaignId?: string | Types.ObjectId | null;
  applicationId?: string | Types.ObjectId | null;
  emailEventId?: string | Types.ObjectId | null;
  title: string;
  message: string;
  type?: NotificationType;
  source?: NotificationSource;
  channels?: NotificationChannel[];
}

export interface NotificationPreference {
  channels: NotificationChannel[];
  enabled: boolean;
}

export interface NotificationDispatchResult {
  channel: NotificationChannel;
  success: boolean;
  providerMessageId?: string;
  error?: string;
}

export interface TestNotificationInput {
  title?: string;
  message?: string;
  channels?: NotificationChannel[];
}
