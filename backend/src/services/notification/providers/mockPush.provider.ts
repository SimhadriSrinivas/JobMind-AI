import { INotification } from "../../../models/notification.model";

export interface PushDeliveryResult {
  success: boolean;
  providerMessageId?: string;
  error?: string;
}

export class MockPushProvider {
  async send(notification: INotification): Promise<PushDeliveryResult> {
    return {
      success: true,
      providerMessageId: `mock-push-${notification._id.toString()}`,
    };
  }
}
