import mongoose, { Document, Schema, Types } from "mongoose";
import {
  NotificationChannel,
  NotificationDeliveryStatus,
  NotificationSource,
  NotificationType,
  notificationChannels,
  notificationDeliveryStatuses,
  notificationSources,
  notificationTypes,
} from "../types/notification.types";

export interface INotification extends Document {
  userId: Types.ObjectId;
  campaignId?: Types.ObjectId | null;
  applicationId?: Types.ObjectId | null;
  emailEventId?: Types.ObjectId | null;
  title: string;
  message: string;
  type: NotificationType;
  source: NotificationSource;
  isRead: boolean;
  deliveryStatus: NotificationDeliveryStatus;
  channels: NotificationChannel[];
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      default: null,
      index: true,
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      default: null,
      index: true,
    },
    emailEventId: {
      type: Schema.Types.ObjectId,
      ref: "EmailEvent",
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    type: {
      type: String,
      enum: notificationTypes,
      default: "INFO",
      index: true,
    },
    source: {
      type: String,
      enum: notificationSources,
      default: "SYSTEM",
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    deliveryStatus: {
      type: String,
      enum: notificationDeliveryStatuses,
      default: "PENDING",
      index: true,
    },
    channels: {
      type: [String],
      enum: notificationChannels,
      default: ["IN_APP"],
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, source: 1, createdAt: -1 });

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
