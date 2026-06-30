import Notification, { INotification } from "../../models/notification.model";
import { NotificationDispatchResult } from "../../types/notification.types";
import { deliverEmailNotification } from "./emailNotification.service";
import { deliverInAppNotification } from "./inAppNotification.service";
import { sendPushNotification } from "./pushProvider.service";

export const dispatchNotification = async (
  notificationId: string
): Promise<NotificationDispatchResult[]> => {
  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return [];
  }

  const results = await Promise.all(
    notification.channels.map((channel) => {
      if (channel === "IN_APP") {
        return deliverInAppNotification(notification);
      }

      if (channel === "EMAIL") {
        return deliverEmailNotification(notification);
      }

      return deliverPush(notification);
    })
  );

  notification.deliveryStatus = results.every((result) => result.success)
    ? "SENT"
    : "FAILED";

  await notification.save();

  return results;
};

const deliverPush = async (
  notification: INotification
): Promise<NotificationDispatchResult> => {
  const result = await sendPushNotification(notification);

  return {
    channel: "PUSH",
    success: result.success,
    providerMessageId: result.providerMessageId,
    error: result.error,
  };
};
