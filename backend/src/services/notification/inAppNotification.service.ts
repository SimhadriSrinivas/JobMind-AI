import { INotification } from "../../models/notification.model";
import { NotificationDispatchResult } from "../../types/notification.types";

export const deliverInAppNotification = async (
  _notification: INotification
): Promise<NotificationDispatchResult> => {
  return {
    channel: "IN_APP",
    success: true,
  };
};
