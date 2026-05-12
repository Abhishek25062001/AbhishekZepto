import type { Types } from 'mongoose';

export type AuditActorSurface =
  | 'customer_app'
  | 'delivery_agent_app'
  | 'vendor_panel'
  | 'admin_dashboard'
  | 'backend';

export type AuditLogStatus = 'success' | 'failed';

export type CreateAuditLogInput = {
  eventType: string;
  actorId: Types.ObjectId | null;
  actorRole: string | null;
  actorSurface: AuditActorSurface | null;
  entityType: string | null;
  entityId: Types.ObjectId | null;
  vendorId: Types.ObjectId | null;
  storeId: Types.ObjectId | null;
  cityId: Types.ObjectId | null;
  requestId: string | null;
  traceId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown>;
  status: AuditLogStatus;
};
