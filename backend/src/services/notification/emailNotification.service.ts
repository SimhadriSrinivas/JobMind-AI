import { INotification } from "../../models/notification.model";
import { NotificationDispatchResult } from "../../types/notification.types";

export const deliverEmailNotification = async (
  notification: INotification
): Promise<NotificationDispatchResult> => {
  return {
    channel: "EMAIL",
    success: true,
    providerMessageId: `mock-email-${notification._id.toString()}`,
  };
};
