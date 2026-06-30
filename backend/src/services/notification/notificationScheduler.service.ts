import { INotification } from "../../models/notification.model";
import { enqueueNotification } from "./notificationQueue.service";

export const scheduleNotificationDelivery = (
  notification: INotification,
  delayMs = 0
): void => {
  if (delayMs <= 0) {
    enqueueNotification(notification);
    return;
  }

  setTimeout(() => {
    enqueueNotification(notification);
  }, delayMs);
};
