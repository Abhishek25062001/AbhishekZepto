import type { Types } from 'mongoose';
import type {
  ADMIN_CONTROL_ACTIVE_MODULE,
  ADMIN_CONTROL_SESSION_TYPE,
} from '../constants/admin-control-session.constants';

export type AdminControlSessionType =
  (typeof ADMIN_CONTROL_SESSION_TYPE)[keyof typeof ADMIN_CONTROL_SESSION_TYPE];

export type AdminControlActiveModule =
  (typeof ADMIN_CONTROL_ACTIVE_MODULE)[keyof typeof ADMIN_CONTROL_ACTIVE_MODULE];

export type AdminControlSessionRecord = {
  adminId: Types.ObjectId;
  sessionType: AdminControlSessionType;
  cityScope: Types.ObjectId[];
  startedAt: Date;
  endedAt: Date | null;
  activeModules: AdminControlActiveModule[];
  lastHeartbeatAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAdminControlSessionInput = {
  adminId: string;
  sessionType: AdminControlSessionType;
  cityScope: string[];
  activeModules: AdminControlActiveModule[];
};

export type AdminControlSessionResponse = {
  sessionId: string;
  adminId: string;
  sessionType: AdminControlSessionType;
  cityScope: string[];
  startedAt: string;
  endedAt: string | null;
  activeModules: AdminControlActiveModule[];
  lastHeartbeatAt: string;
};
