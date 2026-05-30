import { create } from 'zustand';
import type { InAppNotification } from '../../../../../../packages/shared/api';

type NotificationCenterState = {
  notifications: InAppNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number };
  setNotifications: (notifications: InAppNotification[], pagination?: NotificationCenterState['pagination']) => void;
  prependNotification: (notification: InAppNotification) => void;
  setUnreadCount: (unreadCount: number) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllRead: () => void;
  clearNotificationState: () => void;
};

const initialPagination = { page: 1, limit: 20, total: 0 };

export const useNotificationCenterStore = create<NotificationCenterState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  pagination: initialPagination,
  setNotifications: (notifications, pagination = initialPagination) => set({ notifications, pagination }),
  prependNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
    })),
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  markNotificationRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({ ...notification, isRead: true })),
      unreadCount: 0,
    })),
  clearNotificationState: () => set({ notifications: [], unreadCount: 0, pagination: initialPagination, error: null, isLoading: false }),
}));
