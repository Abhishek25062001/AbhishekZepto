"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNotificationCenterStore = void 0;
const zustand_1 = require("zustand");
const initialPagination = { page: 1, limit: 20, total: 0 };
exports.useNotificationCenterStore = (0, zustand_1.create)((set) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    pagination: initialPagination,
    setNotifications: (notifications, pagination = initialPagination) => set({ notifications, pagination }),
    prependNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
    })),
    setUnreadCount: (unreadCount) => set({ unreadCount }),
    markNotificationRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map((notification) => notification.id === notificationId ? { ...notification, isRead: true } : notification),
        unreadCount: Math.max(0, state.unreadCount - 1),
    })),
    markAllRead: () => set((state) => ({
        notifications: state.notifications.map((notification) => ({ ...notification, isRead: true })),
        unreadCount: 0,
    })),
    clearNotificationState: () => set({ notifications: [], unreadCount: 0, pagination: initialPagination, error: null, isLoading: false }),
}));
