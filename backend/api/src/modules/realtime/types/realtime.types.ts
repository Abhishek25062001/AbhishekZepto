import type { Server, Socket } from 'socket.io';
import type { AuthRole } from '../../auth/types/auth-role.types';
import type { PermissionCode } from '../../auth/types/auth-permission.types';
import type { RealtimeEventName } from '../constants/realtime-events.constant';

export const SOCKET_USER_ROLE = {
  CUSTOMER: 'customer',
  DELIVERY_AGENT: 'delivery_agent',
  VENDOR: 'vendor',
  ADMIN: 'admin',
} as const;

export type SocketUserRole = (typeof SOCKET_USER_ROLE)[keyof typeof SOCKET_USER_ROLE];

export type SocketUserPayload = {
  userId: string;
  role: AuthRole;
  socketRole: SocketUserRole;
  sessionId: string;
  permissions: PermissionCode[];
  vendorId: string | null;
  storeId: string | null;
  cityId: string | null;
};

export type SocketConnectionMeta = {
  socketId: string;
  namespace: string;
  connectedAt: Date;
  userAgent: string | null;
  ipAddress: string | null;
};

export type RealtimeRoomType =
  | 'customer'
  | 'delivery'
  | 'vendor'
  | 'order'
  | 'assignment'
  | 'city'
  | 'admin_operations';

export type RealtimeEventPayload<TData extends Record<string, unknown> = Record<string, unknown>> = {
  eventName: RealtimeEventName;
  roomName: string;
  emittedAt: string;
  data: TData;
};

export type AuthenticatedSocket = Socket & {
  data: Socket['data'] & {
    user?: SocketUserPayload;
    meta?: SocketConnectionMeta;
  };
};

export type RealtimeServer = Server;
