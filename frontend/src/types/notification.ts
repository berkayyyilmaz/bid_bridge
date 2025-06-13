export interface Notification {
  id: string;
  profile_id: string;
  type: string;
  data: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationApiResponse {
  id: string;
  profileId: string;
  type: string;
  data: string;
  isRead: boolean;
  createdAt: string;
}

export function transformNotificationFromApi(
  apiNotification: NotificationApiResponse
): Notification {
  return {
    id: apiNotification.id,
    profile_id: apiNotification.profileId,
    type: apiNotification.type,
    data: apiNotification.data,
    is_read: apiNotification.isRead,
    created_at: apiNotification.createdAt,
  };
}
