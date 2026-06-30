import {
  NotificationChannel,
  NotificationPreference,
} from "../../types/notification.types";

export const getNotificationPreference = async (
  _userId: string
): Promise<NotificationPreference> => {
  return {
    enabled: true,
    channels: ["IN_APP", "PUSH", "EMAIL"],
  };
};

export const filterChannelsByPreference = async (
  userId: string,
  requestedChannels: NotificationChannel[]
): Promise<NotificationChannel[]> => {
  const preference = await getNotificationPreference(userId);

  if (!preference.enabled) {
    return [];
  }

  return requestedChannels.filter((channel) => {
    return preference.channels.includes(channel);
  });
};
