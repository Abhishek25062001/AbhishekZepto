import { Types } from 'mongoose';

import { IN_APP_NOTIFICATION_PRIORITY } from '../constants/in-app-notification-priority.constant';
import { IN_APP_NOTIFICATION_SURFACE } from '../constants/in-app-notification-surface.constant';
import { IN_APP_NOTIFICATION_TYPE } from '../constants/in-app-notification-type.constant';
import type { InAppNotificationPriority } from '../constants/in-app-notification-priority.constant';
import { createInAppNotification } from './in-app-notification.service';

type NotificationPayload = {
  title?: string;
  message?: string;
  dataPayload?: Record<string, unknown>;
  priority?: InAppNotificationPriority;
};

const toObjectId = (value: string): Types.ObjectId => new Types.ObjectId(value);

export const notifyCustomerOrderUpdate = async (
  customerId: string,
  payload: NotificationPayload,
) =>
  createInAppNotification({
    appSurface: IN_APP_NOTIFICATION_SURFACE.CUSTOMER_APP,
    dataPayload: payload.dataPayload ?? {},
    message: payload.message ?? 'Your order status has been updated.',
    notificationType: IN_APP_NOTIFICATION_TYPE.ORDER_UPDATE,
    priority: payload.priority ?? IN_APP_NOTIFICATION_PRIORITY.NORMAL,
    role: 'customer',
    title: payload.title ?? 'Order update',
    userId: toObjectId(customerId),
  });

export const notifyDeliveryAssignment = async (
  deliveryAgentId: string,
  payload: NotificationPayload,
) =>
  createInAppNotification({
    appSurface: IN_APP_NOTIFICATION_SURFACE.DELIVERY_AGENT_APP,
    dataPayload: payload.dataPayload ?? {},
    message: payload.message ?? 'A delivery assignment is ready for review.',
    notificationType: IN_APP_NOTIFICATION_TYPE.ASSIGNMENT_UPDATE,
    priority: payload.priority ?? IN_APP_NOTIFICATION_PRIORITY.HIGH,
    role: 'delivery_agent',
    title: payload.title ?? 'New assignment',
    userId: toObjectId(deliveryAgentId),
  });

export const notifyVendorOrderUpdate = async (
  vendorUserId: string,
  payload: NotificationPayload,
) =>
  createInAppNotification({
    appSurface: IN_APP_NOTIFICATION_SURFACE.VENDOR_PANEL,
    dataPayload: payload.dataPayload ?? {},
    message: payload.message ?? 'A store order update is available.',
    notificationType: IN_APP_NOTIFICATION_TYPE.ORDER_UPDATE,
    priority: payload.priority ?? IN_APP_NOTIFICATION_PRIORITY.NORMAL,
    role: 'vendor',
    title: payload.title ?? 'Store order update',
    userId: toObjectId(vendorUserId),
  });

export const notifyAdminSlaAlert = async (
  adminUserId: string,
  payload: NotificationPayload,
) =>
  createInAppNotification({
    appSurface: IN_APP_NOTIFICATION_SURFACE.ADMIN_DASHBOARD,
    dataPayload: payload.dataPayload ?? {},
    message: payload.message ?? 'A delivery SLA alert requires attention.',
    notificationType: IN_APP_NOTIFICATION_TYPE.SLA_ALERT,
    priority: payload.priority ?? IN_APP_NOTIFICATION_PRIORITY.CRITICAL,
    role: 'admin',
    title: payload.title ?? 'SLA alert',
    userId: toObjectId(adminUserId),
  });
