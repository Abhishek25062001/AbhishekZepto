import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { ADMIN_ACTION_TYPE } from '../../admin-control/constants/admin-action-types';
import { writeAdminActionAudit } from '../../admin-control/services/admin-audit-log.service';
import {
  findAdminDeliveryAgentById,
  listAdminDeliveryAgentAssignments,
  listAdminDeliveryAgentAudit,
  listAdminDeliveryAgents,
  updateAdminDeliveryAgentStatus,
  updateAdminDeliveryAgentVerification,
} from '../repositories/admin-delivery-agent.repository';
import type {
  DeliveryAgentManagementStatus,
  DeliveryAgentManagementVerificationStatus,
  ListDeliveryAgentAssignmentsInput,
  ListDeliveryAgentAuditInput,
  ListDeliveryAgentsInput,
  PaginatedDeliveryAgentAssignments,
  PaginatedDeliveryAgentAudit,
  PaginatedDeliveryAgents,
} from '../types/admin-delivery-agent-management.types';
import {
  mapAdminDeliveryAgentAssignmentSummary,
  mapAdminDeliveryAgentAuditSummary,
  mapAdminDeliveryAgentSummary,
} from './admin-delivery-agent.mapper';

type AuditContext = {
  actorAdminId: string | null;
  reason?: string | null;
  ipAddress?: string | null;
  deviceInfo?: string | null;
};

const normalizeId = (value?: { toString: () => string } | string | null): string | null =>
  value ? value.toString() : null;

const writeDeliveryAgentAudit = async ({
  audit,
  actionType,
  deliveryAgentId,
  beforeState,
  afterState,
  fallbackReason,
}: {
  audit?: AuditContext;
  actionType: typeof ADMIN_ACTION_TYPE[keyof typeof ADMIN_ACTION_TYPE];
  deliveryAgentId: string;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  fallbackReason: string;
}) => {
  if (!audit?.actorAdminId) {
    return;
  }

  await writeAdminActionAudit({
    adminId: audit.actorAdminId,
    actionType,
    entityType: 'delivery_agent',
    entityId: deliveryAgentId,
    beforeState,
    afterState,
    reason: audit.reason ?? fallbackReason,
    ipAddress: audit.ipAddress ?? null,
    deviceInfo: audit.deviceInfo ?? null,
  });
};

const assertDeliveryAgentCityScope = (
  deliveryAgentCityId: { toString: () => string } | string | null | undefined,
  actorCityId?: string | null,
) => {
  if (!actorCityId) {
    return;
  }

  if (normalizeId(deliveryAgentCityId) !== actorCityId) {
    throw new AppError({
      message: 'Delivery agent is outside the admin city scope',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.INVALID_ADMIN_SCOPE,
    });
  }
};

export const getAdminDeliveryAgentOrThrow = async (
  deliveryAgentId: string,
  actorCityId?: string | null,
) => {
  const agent = await findAdminDeliveryAgentById(deliveryAgentId);

  if (!agent) {
    throw new AppError({
      message: 'Delivery agent not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_FOUND,
    });
  }

  assertDeliveryAgentCityScope(agent.cityId, actorCityId);

  return agent;
};

export const listDeliveryAgentsForAdmin = async (
  input: ListDeliveryAgentsInput,
): Promise<PaginatedDeliveryAgents> => {
  if (input.actorCityId && input.cityId && input.cityId !== input.actorCityId) {
    throw new AppError({
      message: 'Delivery agent list city filter is outside the admin city scope',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.INVALID_ADMIN_SCOPE,
    });
  }

  const { actorCityId, ...filters } = input;
  const { items, total } = await listAdminDeliveryAgents({
    ...filters,
    cityId: actorCityId ?? filters.cityId,
  });

  return {
    items: items.map(mapAdminDeliveryAgentSummary),
    page: input.page,
    limit: input.limit,
    total,
  };
};

export const getDeliveryAgentForAdmin = async (
  deliveryAgentId: string,
  actorCityId?: string | null,
) => {
  const agent = await getAdminDeliveryAgentOrThrow(deliveryAgentId, actorCityId);
  return mapAdminDeliveryAgentSummary(agent);
};

export const listDeliveryAgentAssignmentsForAdmin = async (
  input: ListDeliveryAgentAssignmentsInput,
): Promise<PaginatedDeliveryAgentAssignments> => {
  await getAdminDeliveryAgentOrThrow(input.deliveryAgentId, input.actorCityId);
  const { items, total } = await listAdminDeliveryAgentAssignments(input);

  return {
    items: items.map(mapAdminDeliveryAgentAssignmentSummary),
    page: input.page,
    limit: input.limit,
    total,
  };
};

export const listDeliveryAgentAuditForAdmin = async (
  input: ListDeliveryAgentAuditInput,
): Promise<PaginatedDeliveryAgentAudit> => {
  await getAdminDeliveryAgentOrThrow(input.deliveryAgentId, input.actorCityId);
  const { items, total } = await listAdminDeliveryAgentAudit(input);

  return {
    items: items.map(mapAdminDeliveryAgentAuditSummary),
    page: input.page,
    limit: input.limit,
    total,
  };
};

export const updateDeliveryAgentStatusForAdmin = async ({
  deliveryAgentId,
  status,
  reason,
  adminId,
  actorCityId,
  audit,
}: {
  deliveryAgentId: string;
  status: DeliveryAgentManagementStatus;
  reason: string;
  adminId: string | null;
  actorCityId?: string | null;
  audit?: AuditContext;
}) => {
  const beforeAgent = await getAdminDeliveryAgentOrThrow(deliveryAgentId, actorCityId);
  const beforeState = mapAdminDeliveryAgentSummary(beforeAgent);
  const agent = await updateAdminDeliveryAgentStatus({
    deliveryAgentId,
    status,
    adminId,
    reason,
  });

  if (!agent) {
    throw new AppError({
      message: 'Delivery agent not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_FOUND,
    });
  }

  const afterState = mapAdminDeliveryAgentSummary(agent);
  await writeDeliveryAgentAudit({
    audit,
    actionType: ADMIN_ACTION_TYPE.DELIVERY_AGENT_STATUS_CHANGED,
    deliveryAgentId,
    beforeState,
    afterState,
    fallbackReason: reason,
  });

  return afterState;
};

export const updateDeliveryAgentVerificationForAdmin = async ({
  deliveryAgentId,
  verificationStatus,
  reason,
  actorCityId,
  audit,
}: {
  deliveryAgentId: string;
  verificationStatus: DeliveryAgentManagementVerificationStatus;
  reason: string;
  adminId: string | null;
  actorCityId?: string | null;
  audit?: AuditContext;
}) => {
  const beforeAgent = await getAdminDeliveryAgentOrThrow(deliveryAgentId, actorCityId);
  const beforeState = mapAdminDeliveryAgentSummary(beforeAgent);
  const agent = await updateAdminDeliveryAgentVerification({
    deliveryAgentId,
    verificationStatus,
  });

  if (!agent) {
    throw new AppError({
      message: 'Delivery agent not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_FOUND,
    });
  }

  const afterState = mapAdminDeliveryAgentSummary(agent);
  await writeDeliveryAgentAudit({
    audit,
    actionType: ADMIN_ACTION_TYPE.DELIVERY_AGENT_VERIFICATION_CHANGED,
    deliveryAgentId,
    beforeState,
    afterState,
    fallbackReason: reason,
  });

  return afterState;
};
