import { Types } from 'mongoose';

import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import { AVAILABILITY_STATUS } from '../../delivery/constants/delivery-agent-status.constant';
import { DeliveryAssignmentModel } from '../../delivery/models/delivery-assignment.model';
import { DeliveryAgentModel } from '../../delivery/models/delivery-agent.model';
import { DeliveryStatus } from '../../delivery/types/delivery-assignment.types';
import { INTERNAL_EVENT_NAMES } from '../../internal-events/constants/internal-event-names.constant';
import { publishInternalEvent } from '../../internal-events/services/internal-event-bus.service';
import { buildEventMetadata } from '../../internal-events/utils/internal-event-metadata.util';
import { ORDER_STATUS } from '../../orders/constants/order-status.constant';
import { OrderModel } from '../../orders/models/order.model';
import { StoreModel } from '../../stores/models/store.model';
import { ADMIN_ACTION_TYPE } from '../constants/admin-action-types';
import {
  emitAdminAgentStatusChanged,
  emitAdminLiveOrderUpdated,
  emitAdminSlaEscalationCreated,
  emitAdminStoreOperationalChanged,
} from './admin-control-realtime.service';
import { writeAdminActionAudit } from './admin-audit-log.service';
import type {
  AdminActionType,
} from '../types/admin-action-audit.types';
import type {
  AdminControlActor,
  AdminControlOperationResponse,
} from '../types/admin-control-operation.types';

const toObjectId = (value: string): Types.ObjectId => new Types.ObjectId(value);

const assertAdminCityScope = (
  actor: AdminControlActor,
  targetCityId?: string | null,
): void => {
  if (!actor.cityId || !targetCityId || actor.role === AUTH_ROLE.SUPER_ADMIN) {
    return;
  }

  if (actor.cityId !== targetCityId) {
    throw new AppError({
      message: 'Admin city scope does not include this entity',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.INVALID_ADMIN_SCOPE,
    });
  }
};

const buildResponse = ({
  entityType,
  entityId,
  actionType,
  status,
  reason,
  updatedAt,
}: {
  entityType: string;
  entityId: string;
  actionType: AdminActionType;
  status: string;
  reason: string;
  updatedAt: Date;
}): AdminControlOperationResponse => ({
  entityType,
  entityId,
  actionType,
  status,
  reason,
  updatedAt: updatedAt.toISOString(),
});

const publishAdminEvent = (
  eventName: typeof INTERNAL_EVENT_NAMES[keyof typeof INTERNAL_EVENT_NAMES],
  payload: Record<string, unknown>,
  actor: AdminControlActor,
): void => {
  publishInternalEvent(
    eventName,
    payload,
    buildEventMetadata('admin-control', {
      eventName,
      actorId: actor.adminId,
      actorRole: actor.role,
      requestId: actor.requestId,
      traceId: actor.traceId,
    }),
  );
};

const snapshot = (record: unknown): Record<string, unknown> => {
  if (!record || typeof record !== 'object') {
    return {};
  }

  if ('toObject' in record && typeof record.toObject === 'function') {
    return record.toObject() as Record<string, unknown>;
  }

  return record as Record<string, unknown>;
};

const writeOverrideAudit = async ({
  actor,
  actionType,
  entityType,
  entityId,
  beforeState,
  afterState,
  reason,
}: {
  actor: AdminControlActor;
  actionType: AdminActionType;
  entityType: string;
  entityId: string;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  reason: string;
}): Promise<void> => {
  await writeAdminActionAudit({
    adminId: actor.adminId,
    actionType,
    entityType,
    entityId,
    beforeState,
    afterState,
    reason,
    ipAddress: actor.ipAddress,
    deviceInfo: actor.deviceInfo,
  });
};

export const forceCancelOrder = async ({
  orderId,
  reason,
  actor,
}: {
  orderId: string;
  reason: string;
  actor: AdminControlActor;
}): Promise<AdminControlOperationResponse> => {
  const now = new Date();
  const before = await OrderModel.findById(orderId).lean();

  if (!before) {
    throw new AppError({
      message: 'Order not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.ORDER_NOT_FOUND,
    });
  }

  if (before.orderStatus === ORDER_STATUS.CANCELLED) {
    throw new AppError({
      message: 'Order is already cancelled',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.ORDER_ALREADY_CANCELLED,
    });
  }

  const order = await OrderModel.findByIdAndUpdate(
    orderId,
    {
      $set: {
        orderStatus: ORDER_STATUS.CANCELLED,
        cancellationReason: reason,
        cancelReason: reason,
        cancelledAt: now,
        cancelledBy: {
          actorId: toObjectId(actor.adminId),
          actorType: 'admin',
          actorRole: actor.role,
        },
        refundReviewRequired: true,
      },
      $push: {
        timeline: {
          event: 'admin.order_force_cancelled',
          fromStatus: null,
          toStatus: ORDER_STATUS.CANCELLED,
          actorId: toObjectId(actor.adminId),
          actorType: 'admin',
          actorRole: actor.role,
          reason,
          createdAt: now,
        },
      },
    },
    { new: true },
  ).exec();

  if (!order) {
    throw new AppError({
      message: 'Order not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.ORDER_NOT_FOUND,
    });
  }

  publishAdminEvent(
    INTERNAL_EVENT_NAMES.ADMIN_ORDER_FORCE_CANCELLED,
    { orderId, status: order.orderStatus, reason },
    actor,
  );
  emitAdminLiveOrderUpdated({
    orderId,
    status: order.orderStatus,
    actionType: ADMIN_ACTION_TYPE.FORCE_ORDER_CANCEL,
    reason,
    updatedAt: order.updatedAt.toISOString(),
  });
  await writeOverrideAudit({
    actor,
    actionType: ADMIN_ACTION_TYPE.FORCE_ORDER_CANCEL,
    entityType: 'order',
    entityId: orderId,
    beforeState: snapshot(before),
    afterState: snapshot(order),
    reason,
  });

  return buildResponse({
    entityType: 'order',
    entityId: orderId,
    actionType: ADMIN_ACTION_TYPE.FORCE_ORDER_CANCEL,
    status: order.orderStatus,
    reason,
    updatedAt: order.updatedAt,
  });
};

export const forceAssignAgent = async ({
  orderId,
  deliveryAgentId,
  reason,
  actor,
}: {
  orderId: string;
  deliveryAgentId: string;
  reason: string;
  actor: AdminControlActor;
}): Promise<AdminControlOperationResponse> => {
  const agent = await DeliveryAgentModel.findById(deliveryAgentId).exec();
  if (!agent || agent.isDeleted || !agent.isActive) {
    throw new AppError({
      message: 'Delivery agent not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_FOUND,
    });
  }

  if (agent.availabilityStatus !== AVAILABILITY_STATUS.ONLINE) {
    throw new AppError({
      message: 'Delivery agent is not available',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.DELIVERY_AGENT_UNAVAILABLE,
    });
  }

  const now = new Date();
  const before = await DeliveryAssignmentModel.findOne({ orderId: toObjectId(orderId) }).lean();
  assertAdminCityScope(actor, before?.cityId?.toString() ?? agent.cityId?.toString() ?? null);
  const assignment = await DeliveryAssignmentModel.findOneAndUpdate(
    { orderId: toObjectId(orderId) },
    {
      $set: {
        deliveryAgentId: toObjectId(deliveryAgentId),
        deliveryStatus: DeliveryStatus.ASSIGNED,
        assignmentSource: 'admin_force',
        assignedAt: now,
      },
      $push: {
        timeline: {
          actorType: 'admin',
          actorId: toObjectId(actor.adminId),
          fromStatus: 'pending_assignment',
          toStatus: DeliveryStatus.ASSIGNED,
          reason,
          createdAt: now,
        },
      },
    },
    { new: true },
  ).exec();

  if (!assignment) {
    throw new AppError({
      message: 'Delivery assignment not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_ASSIGNMENT_NOT_FOUND,
    });
  }

  await DeliveryAgentModel.findByIdAndUpdate(deliveryAgentId, {
    $set: { currentAssignmentId: assignment._id },
  }).exec();

  publishAdminEvent(
    INTERNAL_EVENT_NAMES.ADMIN_FORCE_ASSIGNMENT_CREATED,
    { orderId, assignmentId: assignment._id.toString(), deliveryAgentId, reason },
    actor,
  );
  emitAdminLiveOrderUpdated({
    orderId,
    assignmentId: assignment._id.toString(),
    deliveryAgentId,
    status: assignment.deliveryStatus,
    actionType: ADMIN_ACTION_TYPE.FORCE_ASSIGNMENT,
    reason,
    updatedAt: assignment.updatedAt.toISOString(),
  }, assignment.cityId.toString());
  await writeOverrideAudit({
    actor,
    actionType: ADMIN_ACTION_TYPE.FORCE_ASSIGNMENT,
    entityType: 'delivery_assignment',
    entityId: assignment._id.toString(),
    beforeState: snapshot(before),
    afterState: snapshot(assignment),
    reason,
  });

  return buildResponse({
    entityType: 'delivery_assignment',
    entityId: assignment._id.toString(),
    actionType: ADMIN_ACTION_TYPE.FORCE_ASSIGNMENT,
    status: assignment.deliveryStatus,
    reason,
    updatedAt: assignment.updatedAt,
  });
};

export const unassignAgent = async ({
  orderId,
  reason,
  actor,
}: {
  orderId: string;
  reason: string;
  actor: AdminControlActor;
}): Promise<AdminControlOperationResponse> => {
  const now = new Date();
  const before = await DeliveryAssignmentModel.findOne({ orderId: toObjectId(orderId) }).lean();
  assertAdminCityScope(actor, before?.cityId?.toString() ?? null);
  const assignment = await DeliveryAssignmentModel.findOneAndUpdate(
    { orderId: toObjectId(orderId) },
    {
      $set: {
        deliveryAgentId: null,
        deliveryStatus: DeliveryStatus.PENDING_ASSIGNMENT,
        unassignedReason: reason,
        unassignedAt: now,
        unassignedBy: toObjectId(actor.adminId),
      },
      $push: {
        timeline: {
          actorType: 'admin',
          actorId: toObjectId(actor.adminId),
          fromStatus: 'assigned',
          toStatus: DeliveryStatus.PENDING_ASSIGNMENT,
          reason,
          createdAt: now,
        },
      },
    },
    { new: true },
  ).exec();

  if (!assignment) {
    throw new AppError({
      message: 'Delivery assignment not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_ASSIGNMENT_NOT_FOUND,
    });
  }
  emitAdminLiveOrderUpdated({
    orderId,
    assignmentId: assignment._id.toString(),
    status: assignment.deliveryStatus,
    actionType: ADMIN_ACTION_TYPE.FORCE_UNASSIGN,
    reason,
    updatedAt: assignment.updatedAt.toISOString(),
  }, assignment.cityId.toString());
  await writeOverrideAudit({
    actor,
    actionType: ADMIN_ACTION_TYPE.FORCE_UNASSIGN,
    entityType: 'delivery_assignment',
    entityId: assignment._id.toString(),
    beforeState: snapshot(before),
    afterState: snapshot(assignment),
    reason,
  });

  return buildResponse({
    entityType: 'delivery_assignment',
    entityId: assignment._id.toString(),
    actionType: ADMIN_ACTION_TYPE.FORCE_UNASSIGN,
    status: assignment.deliveryStatus,
    reason,
    updatedAt: assignment.updatedAt,
  });
};

export const forceCloseStore = async ({
  storeId,
  reason,
  actor,
}: {
  storeId: string;
  reason: string;
  actor: AdminControlActor;
}): Promise<AdminControlOperationResponse> => {
  const now = new Date();
  const before = await StoreModel.findById(storeId).lean();

  if (!before) {
    throw new AppError({
      message: 'Store not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.STORE_NOT_FOUND,
    });
  }

  assertAdminCityScope(actor, before.cityId?.toString() ?? null);

  if (before.storeOperationalStatus === 'force_closed') {
    throw new AppError({
      message: 'Store is already force-closed',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.STORE_ALREADY_CLOSED,
    });
  }

  const store = await StoreModel.findByIdAndUpdate(
    storeId,
    {
      $set: {
        isOpen: false,
        isAcceptingOrders: false,
        storeOperationalStatus: 'force_closed',
        forceClosedAt: now,
        forceClosedReason: reason,
        forceClosedBy: toObjectId(actor.adminId),
      },
    },
    { new: true },
  ).exec();

  if (!store) {
    throw new AppError({
      message: 'Store not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.STORE_NOT_FOUND,
    });
  }
  emitAdminStoreOperationalChanged({
    storeId,
    status: store.storeOperationalStatus ?? 'force_closed',
    isOpen: store.isOpen,
    isAcceptingOrders: store.isAcceptingOrders,
    actionType: ADMIN_ACTION_TYPE.FORCE_STORE_CLOSE,
    reason,
    updatedAt: store.updatedAt.toISOString(),
  }, store.cityId?.toString() ?? null);
  await writeOverrideAudit({
    actor,
    actionType: ADMIN_ACTION_TYPE.FORCE_STORE_CLOSE,
    entityType: 'store',
    entityId: storeId,
    beforeState: snapshot(before),
    afterState: snapshot(store),
    reason,
  });

  return buildResponse({
    entityType: 'store',
    entityId: storeId,
    actionType: ADMIN_ACTION_TYPE.FORCE_STORE_CLOSE,
    status: store.storeOperationalStatus ?? 'force_closed',
    reason,
    updatedAt: store.updatedAt,
  });
};

export const reopenStore = async ({
  storeId,
  reason,
  actor,
}: {
  storeId: string;
  reason: string;
  actor: AdminControlActor;
}): Promise<AdminControlOperationResponse> => {
  const before = await StoreModel.findById(storeId).lean();
  assertAdminCityScope(actor, before?.cityId?.toString() ?? null);
  const store = await StoreModel.findByIdAndUpdate(
    storeId,
    {
      $set: {
        isOpen: true,
        isAcceptingOrders: true,
        storeOperationalStatus: 'open',
        forceClosedAt: null,
        forceClosedReason: null,
        forceClosedBy: null,
      },
    },
    { new: true },
  ).exec();

  if (!store) {
    throw new AppError({
      message: 'Store not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.STORE_NOT_FOUND,
    });
  }
  emitAdminStoreOperationalChanged({
    storeId,
    status: store.storeOperationalStatus ?? 'open',
    isOpen: store.isOpen,
    isAcceptingOrders: store.isAcceptingOrders,
    actionType: 'STORE_REOPEN',
    reason,
    updatedAt: store.updatedAt.toISOString(),
  }, store.cityId?.toString() ?? null);
  await writeOverrideAudit({
    actor,
    actionType: 'STORE_REOPEN',
    entityType: 'store',
    entityId: storeId,
    beforeState: snapshot(before),
    afterState: snapshot(store),
    reason,
  });

  return buildResponse({
    entityType: 'store',
    entityId: storeId,
    actionType: 'STORE_REOPEN',
    status: store.storeOperationalStatus ?? 'open',
    reason,
    updatedAt: store.updatedAt,
  });
};

export const forceAgentOffline = async ({
  agentId,
  reason,
  actor,
}: {
  agentId: string;
  reason: string;
  actor: AdminControlActor;
}): Promise<AdminControlOperationResponse> => {
  const now = new Date();
  const before = await DeliveryAgentModel.findById(agentId).lean();

  if (!before) {
    throw new AppError({
      message: 'Delivery agent not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_FOUND,
    });
  }

  assertAdminCityScope(actor, before.cityId?.toString() ?? null);

  if (before.availabilityStatus === AVAILABILITY_STATUS.OFFLINE) {
    throw new AppError({
      message: 'Delivery agent is already offline',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.AGENT_ALREADY_OFFLINE,
    });
  }

  const agent = await DeliveryAgentModel.findByIdAndUpdate(
    agentId,
    {
      $set: {
        availabilityStatus: AVAILABILITY_STATUS.OFFLINE,
        forcedOfflineAt: now,
        forcedOfflineReason: reason,
        forcedOfflineBy: toObjectId(actor.adminId),
      },
    },
    { new: true },
  ).exec();

  if (!agent) {
    throw new AppError({
      message: 'Delivery agent not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_FOUND,
    });
  }
  emitAdminAgentStatusChanged({
    agentId,
    status: agent.availabilityStatus,
    actionType: ADMIN_ACTION_TYPE.FORCE_AGENT_OFFLINE,
    reason,
    updatedAt: agent.updatedAt.toISOString(),
  }, agent.cityId?.toString() ?? null);
  await writeOverrideAudit({
    actor,
    actionType: ADMIN_ACTION_TYPE.FORCE_AGENT_OFFLINE,
    entityType: 'delivery_agent',
    entityId: agentId,
    beforeState: snapshot(before),
    afterState: snapshot(agent),
    reason,
  });

  return buildResponse({
    entityType: 'delivery_agent',
    entityId: agentId,
    actionType: ADMIN_ACTION_TYPE.FORCE_AGENT_OFFLINE,
    status: agent.availabilityStatus,
    reason,
    updatedAt: agent.updatedAt,
  });
};

export const restoreAgentOnline = async ({
  agentId,
  reason,
  actor,
}: {
  agentId: string;
  reason: string;
  actor: AdminControlActor;
}): Promise<AdminControlOperationResponse> => {
  const before = await DeliveryAgentModel.findById(agentId).lean();
  assertAdminCityScope(actor, before?.cityId?.toString() ?? null);
  const agent = await DeliveryAgentModel.findByIdAndUpdate(
    agentId,
    {
      $set: {
        availabilityStatus: AVAILABILITY_STATUS.ONLINE,
        forcedOfflineAt: null,
        forcedOfflineReason: null,
        forcedOfflineBy: null,
      },
    },
    { new: true },
  ).exec();

  if (!agent) {
    throw new AppError({
      message: 'Delivery agent not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_FOUND,
    });
  }
  emitAdminAgentStatusChanged({
    agentId,
    status: agent.availabilityStatus,
    actionType: 'AGENT_RESTORE_ONLINE',
    reason,
    updatedAt: agent.updatedAt.toISOString(),
  }, agent.cityId?.toString() ?? null);
  await writeOverrideAudit({
    actor,
    actionType: 'AGENT_RESTORE_ONLINE',
    entityType: 'delivery_agent',
    entityId: agentId,
    beforeState: snapshot(before),
    afterState: snapshot(agent),
    reason,
  });

  return buildResponse({
    entityType: 'delivery_agent',
    entityId: agentId,
    actionType: 'AGENT_RESTORE_ONLINE',
    status: agent.availabilityStatus,
    reason,
    updatedAt: agent.updatedAt,
  });
};

export const escalateSla = async ({
  slaId,
  reason,
  actor,
  escalationLevel,
}: {
  slaId: string;
  reason: string;
  actor: AdminControlActor;
  escalationLevel: number;
}): Promise<AdminControlOperationResponse> => {
  const now = new Date();
  const before = await DeliveryAssignmentModel.findById(slaId).lean();
  assertAdminCityScope(actor, before?.cityId?.toString() ?? null);
  const assignment = await DeliveryAssignmentModel.findByIdAndUpdate(
    slaId,
    {
      $set: {
        escalationLevel,
        escalatedBy: toObjectId(actor.adminId),
        escalatedAt: now,
        escalationReason: reason,
      },
    },
    { new: true },
  ).exec();

  if (!assignment) {
    throw new AppError({
      message: 'Delivery assignment not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_ASSIGNMENT_NOT_FOUND,
    });
  }
  emitAdminSlaEscalationCreated({
    slaId,
    assignmentId: assignment._id.toString(),
    escalationLevel,
    actionType: ADMIN_ACTION_TYPE.MARK_SLA_ESCALATED,
    reason,
    updatedAt: assignment.updatedAt.toISOString(),
  }, assignment.cityId.toString());
  await writeOverrideAudit({
    actor,
    actionType: ADMIN_ACTION_TYPE.MARK_SLA_ESCALATED,
    entityType: 'sla',
    entityId: slaId,
    beforeState: snapshot(before),
    afterState: snapshot(assignment),
    reason,
  });

  return buildResponse({
    entityType: 'sla',
    entityId: slaId,
    actionType: ADMIN_ACTION_TYPE.MARK_SLA_ESCALATED,
    status: String(assignment.escalationLevel ?? escalationLevel),
    reason,
    updatedAt: assignment.updatedAt,
  });
};
