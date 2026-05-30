export type InAppNotificationType =
  | 'order_update'
  | 'delivery_update'
  | 'assignment_update'
  | 'payment_update'
  | 'refund_update'
  | 'sla_alert'
  | 'system_alert';

export type InAppNotificationPriority = 'low' | 'normal' | 'high' | 'critical';

export type InAppNotificationSurface =
  | 'customer_app'
  | 'delivery_agent_app'
  | 'vendor_panel'
  | 'admin_dashboard';

export type InAppNotification = {
  id: string;
  notificationType: InAppNotificationType;
  title: string;
  message: string;
  dataPayload: Record<string, unknown>;
  priority: InAppNotificationPriority;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};

export type InAppNotificationListQuery = {
  isRead?: boolean;
  notificationType?: InAppNotificationType;
  page?: number;
  limit?: number;
};

export type InAppNotificationListResponse = {
  items: InAppNotification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

export type InAppNotificationUnreadCountResponse = {
  unreadCount: number;
};

export type MarkAllInAppNotificationsReadResponse = {
  updatedCount: number;
};
