import type {
  ApiSuccessResponse,
  InAppNotification,
  InAppNotificationListQuery,
  InAppNotificationListResponse,
  InAppNotificationUnreadCountResponse,
  MarkAllInAppNotificationsReadResponse,
} from '../../../../../../packages/shared/api';
import { apiClient } from '../../../services/api/client';

const basePath = '/admin/me/notifications';

export const adminNotificationApi = {
  list: async (params: InAppNotificationListQuery = {}) => {
    const response = await apiClient.get<ApiSuccessResponse<InAppNotificationListResponse>>(
      basePath,
      { params },
    );
    return response.data.data;
  },
  unreadCount: async () => {
    const response = await apiClient.get<ApiSuccessResponse<InAppNotificationUnreadCountResponse>>(
      `${basePath}/unread-count`,
    );
    return response.data.data;
  },
  markRead: async (notificationId: string) => {
    const response = await apiClient.patch<ApiSuccessResponse<InAppNotification>>(
      `${basePath}/${notificationId}/read`,
    );
    return response.data.data;
  },
  markAllRead: async () => {
    const response = await apiClient.patch<
      ApiSuccessResponse<MarkAllInAppNotificationsReadResponse>
    >(`${basePath}/read-all`);
    return response.data.data;
  },
};
