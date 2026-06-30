import { INotification } from "../../models/notification.model";
import {
  MockPushProvider,
  PushDeliveryResult,
} from "./providers/mockPush.provider";

export interface PushProvider {
  send(notification: INotification): Promise<PushDeliveryResult>;
}

const provider: PushProvider = new MockPushProvider();

export const sendPushNotification = async (
  notification: INotification
): Promise<PushDeliveryResult> => {
  return provider.send(notification);
};
