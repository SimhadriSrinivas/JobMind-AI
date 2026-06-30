import { INotification } from "../../models/notification.model";
import { dispatchNotification } from "./notificationDispatcher.service";

export const enqueueNotification = (notification: INotification): void => {
  setImmediate(() => {
    dispatchNotification(notification._id.toString()).catch(() => undefined);
  });
};
