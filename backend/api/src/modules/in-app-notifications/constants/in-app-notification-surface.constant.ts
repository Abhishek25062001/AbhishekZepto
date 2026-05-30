export const IN_APP_NOTIFICATION_SURFACE = {
  CUSTOMER_APP: 'customer_app',
  DELIVERY_AGENT_APP: 'delivery_agent_app',
  VENDOR_PANEL: 'vendor_panel',
  ADMIN_DASHBOARD: 'admin_dashboard',
} as const;

export type InAppNotificationSurface =
  (typeof IN_APP_NOTIFICATION_SURFACE)[keyof typeof IN_APP_NOTIFICATION_SURFACE];

export const IN_APP_NOTIFICATION_SURFACE_VALUES = Object.values(
  IN_APP_NOTIFICATION_SURFACE,
) as [InAppNotificationSurface, ...InAppNotificationSurface[]];
