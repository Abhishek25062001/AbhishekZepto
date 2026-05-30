import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { Types } from 'mongoose';

import { IN_APP_NOTIFICATION_PRIORITY } from '../constants/in-app-notification-priority.constant';
import { IN_APP_NOTIFICATION_SURFACE } from '../constants/in-app-notification-surface.constant';
import { IN_APP_NOTIFICATION_TYPE } from '../constants/in-app-notification-type.constant';
import * as repositoryModule from '../repositories/in-app-notification.repository';
import {
  createInAppNotification,
  getMyNotifications,
  getUnreadCount,
  markAllRead,
  markRead,
} from '../services/in-app-notification.service';
import type {
  InAppNotificationDocument,
  InAppNotificationUserContext,
} from '../types/in-app-notification.types';

const repository = repositoryModule as unknown as {
  countUnreadNotifications: typeof repositoryModule.countUnreadNotifications;
  createNotification: typeof repositoryModule.createNotification;
  findNotificationById: typeof repositoryModule.findNotificationById;
  listUserNotifications: typeof repositoryModule.listUserNotifications;
  markAllNotificationsRead: typeof repositoryModule.markAllNotificationsRead;
  markNotificationRead: typeof repositoryModule.markNotificationRead;
};

const userId = new Types.ObjectId();
const otherUserId = new Types.ObjectId();
const notificationId = new Types.ObjectId();

const context: InAppNotificationUserContext = {
  appSurface: IN_APP_NOTIFICATION_SURFACE.CUSTOMER_APP,
  role: 'customer',
  userId: userId.toString(),
};

const buildNotification = (
  overrides: Partial<InAppNotificationDocument> = {},
): InAppNotificationDocument => ({
  _id: notificationId,
  appSurface: IN_APP_NOTIFICATION_SURFACE.CUSTOMER_APP,
  archivedAt: null,
  createdAt: new Date('2026-05-30T10:00:00.000Z'),
  dataPayload: { orderId: 'order-1' },
  isArchived: false,
  isRead: false,
  message: 'Message',
  notificationType: IN_APP_NOTIFICATION_TYPE.ORDER_UPDATE,
  priority: IN_APP_NOTIFICATION_PRIORITY.NORMAL,
  readAt: null,
  role: 'customer',
  title: 'Title',
  updatedAt: new Date('2026-05-30T10:00:00.000Z'),
  userId,
  ...overrides,
});

afterEach(() => {
  repository.countUnreadNotifications = repositoryModule.countUnreadNotifications;
  repository.createNotification = repositoryModule.createNotification;
  repository.findNotificationById = repositoryModule.findNotificationById;
  repository.listUserNotifications = repositoryModule.listUserNotifications;
  repository.markAllNotificationsRead = repositoryModule.markAllNotificationsRead;
  repository.markNotificationRead = repositoryModule.markNotificationRead;
});

test('createInAppNotification applies defaults through repository', async () => {
  repository.createNotification = async (payload) =>
    buildNotification({
      dataPayload: payload.dataPayload ?? {},
      priority: payload.priority ?? IN_APP_NOTIFICATION_PRIORITY.NORMAL,
    });

  const notification = await createInAppNotification({
    appSurface: IN_APP_NOTIFICATION_SURFACE.CUSTOMER_APP,
    message: 'Message',
    notificationType: IN_APP_NOTIFICATION_TYPE.ORDER_UPDATE,
    role: 'customer',
    title: 'Title',
    userId,
  });

  assert.equal(notification.isRead, false);
  assert.equal(notification.priority, IN_APP_NOTIFICATION_PRIORITY.NORMAL);
});

test('getMyNotifications scopes list query to authenticated surface and user', async () => {
  let receivedUserId: string | Types.ObjectId | null = null;
  let receivedSurface: string | null = null;

  repository.listUserNotifications = async (query) => {
    receivedUserId = query.userId;
    receivedSurface = query.appSurface;
    return { items: [buildNotification()], total: 1 };
  };

  const result = await getMyNotifications(context, { isRead: false, page: 2, limit: 5 });

  assert.equal(result.total, 1);
  assert.equal(result.page, 2);
  assert.equal(result.limit, 5);
  assert.equal(receivedUserId, userId.toString());
  assert.equal(receivedSurface, IN_APP_NOTIFICATION_SURFACE.CUSTOMER_APP);
});

test('getUnreadCount returns scoped unread count', async () => {
  repository.countUnreadNotifications = async (receivedUserId, receivedSurface) => {
    assert.equal(receivedUserId, userId.toString());
    assert.equal(receivedSurface, IN_APP_NOTIFICATION_SURFACE.CUSTOMER_APP);
    return 7;
  };

  assert.deepEqual(await getUnreadCount(context), { unreadCount: 7 });
});

test('markRead denies another users notification', async () => {
  repository.findNotificationById = async () => buildNotification({ userId: otherUserId });

  await assert.rejects(
    () => markRead(notificationId.toString(), context),
    /Notification does not belong to this user/,
  );
});

test('markRead updates owned notification', async () => {
  repository.findNotificationById = async () => buildNotification();
  repository.markNotificationRead = async () =>
    buildNotification({ isRead: true, readAt: new Date('2026-05-30T10:10:00.000Z') });

  const result = await markRead(notificationId.toString(), context);

  assert.equal(result.isRead, true);
  assert.ok(result.readAt);
});

test('markAllRead returns updated count', async () => {
  repository.markAllNotificationsRead = async () => 3;

  assert.deepEqual(await markAllRead(context), { updatedCount: 3 });
});
