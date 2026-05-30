import type { Server, Socket } from 'socket.io';
import type { PermissionCode } from '../../auth/types/auth-permission.types';
import type { AuthRole } from '../../auth/types/auth-role.types';

export const SOCKET_USER_ROLES = {
  CUSTOMER: 'customer',
  DELIVERY_AGENT: 'delivery_agent',
  VENDOR_OWNER: 'vendor_owner',
  STORE_MANAGER: 'store_manager',
  STORE_STAFF: 'store_staff',
  SUPPORT_ADMIN: 'support_admin',
  OPERATIONS_ADMIN: 'operations_admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export type SocketUserRole = (typeof SOCKET_USER_ROLES)[keyof typeof SOCKET_USER_ROLES];

export type SocketAuthPayload = {
  userId: string;
  role: AuthRole;
  permissions: PermissionCode[];
  sessionId: string;
  cityId: string | null;
  storeId: string | null;
  vendorId: string | null;
};

export type AuthenticatedSocket = Socket & {
  data: Socket['data'] & SocketAuthPayload & {
    user?: SocketAuthPayload;
  };
};

export type SocketServerInstance = Server;
