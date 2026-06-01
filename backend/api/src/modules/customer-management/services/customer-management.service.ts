import { Types } from 'mongoose';

import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { ADMIN_ACTION_TYPE } from '../../admin-control/constants/admin-action-types';
import { AdminActionAuditModel } from '../../admin-control/models/admin-action-audit.model';
import { writeAdminActionAudit } from '../../admin-control/services/admin-audit-log.service';
import { AUTH_ACCOUNT_STATUS } from '../../auth/constants/auth-status.constants';
import { findAddressesByCustomerId } from '../../customer-addresses/repositories/customer-address.repository';
import { listOrdersByAdmin } from '../../orders/repositories/order.repository';
import { toAdminOrderListItemResponse } from '../../orders/utils/order-response.mapper';
import {
  findCustomerAdminProfile,
  findCustomerIdentityById,
  listCustomerIdentities,
  upsertCustomerAdminProfile,
} from '../repositories/customer-management.repository';
import type {
  CustomerManagementAccountStatus,
  ListCustomersInput,
  PaginatedCustomers,
} from '../types/customer-management.types';
import { mapCustomerManagementSummary } from './customer-management.mapper';

type AuditContext = {
  actorAdminId: string | null;
  reason?: string | null;
  ipAddress?: string | null;
  deviceInfo?: string | null;
};

const normalizeId = (value?: { toString: () => string } | string | null): string | null =>
  value ? value.toString() : null;

const writeCustomerAudit = async ({
  audit,
  actionType,
  customerId,
  beforeState,
  afterState,
  fallbackReason,
}: {
  audit?: AuditContext;
  actionType: typeof ADMIN_ACTION_TYPE[keyof typeof ADMIN_ACTION_TYPE];
  customerId: string;
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
    entityType: 'customer',
    entityId: customerId,
    beforeState,
    afterState,
    reason: audit.reason ?? fallbackReason,
    ipAddress: audit.ipAddress ?? null,
    deviceInfo: audit.deviceInfo ?? null,
  });
};

const assertCustomerCityScope = (
  customerCityId: { toString: () => string } | string | null | undefined,
  actorCityId?: string | null,
) => {
  if (!actorCityId) {
    return;
  }

  if (normalizeId(customerCityId) !== actorCityId) {
    throw new AppError({
      message: 'Customer is outside the admin city scope',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.CUSTOMER_SCOPE_DENIED,
    });
  }
};

const getCustomerOrThrow = async (customerId: string, actorCityId?: string | null) => {
  const customer = await findCustomerIdentityById(customerId);

  if (!customer) {
    throw new AppError({
      message: 'Customer not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.CUSTOMER_NOT_FOUND,
    });
  }

  assertCustomerCityScope(customer.cityId, actorCityId);

  return customer;
};

export const listCustomersForAdmin = async (
  input: ListCustomersInput,
): Promise<PaginatedCustomers> => {
  if (input.actorCityId && input.cityId && input.cityId !== input.actorCityId) {
    throw new AppError({
      message: 'Customer list city filter is outside the admin city scope',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.CUSTOMER_SCOPE_DENIED,
    });
  }

  const { actorCityId, ...filters } = input;
  const { items, total } = await listCustomerIdentities({
    ...filters,
    cityId: actorCityId ?? filters.cityId,
  });
  const profiles = await Promise.all(
    items.map((customer) => findCustomerAdminProfile(customer._id.toString())),
  );

  return {
    items: items.map((customer, index) =>
      mapCustomerManagementSummary(customer, profiles[index]),
    ),
    page: input.page,
    limit: input.limit,
    total,
  };
};

export const getCustomerForAdmin = async (customerId: string, actorCityId?: string | null) => {
  const customer = await getCustomerOrThrow(customerId, actorCityId);
  const profile = await findCustomerAdminProfile(customerId);
  return mapCustomerManagementSummary(customer, profile);
};

export const updateCustomerStatusForAdmin = async ({
  customerId,
  status,
  reason,
  adminId,
  actorCityId,
  audit,
}: {
  customerId: string;
  status: CustomerManagementAccountStatus;
  reason: string;
  adminId: string | null;
  actorCityId?: string | null;
  audit?: AuditContext;
}) => {
  const customer = await getCustomerOrThrow(customerId, actorCityId);
  const beforeProfile = await findCustomerAdminProfile(customerId);
  const beforeState = mapCustomerManagementSummary(customer, beforeProfile);

  customer.accountStatus = status;
  customer.updatedBy = adminId && Types.ObjectId.isValid(adminId)
    ? new Types.ObjectId(adminId)
    : customer.updatedBy;
  await customer.save();

  const profile = await upsertCustomerAdminProfile({
    customerId,
    update: {
      ...(status === AUTH_ACCOUNT_STATUS.ACTIVE
        ? { blockedAt: null, blockedBy: null, blockReason: null }
        : {
            blockedAt: new Date(),
            blockedBy: adminId && Types.ObjectId.isValid(adminId)
              ? new Types.ObjectId(adminId)
              : null,
            blockReason: reason,
          }),
      updatedBy: adminId && Types.ObjectId.isValid(adminId)
        ? new Types.ObjectId(adminId)
        : null,
    },
  });

  await writeCustomerAudit({
    audit,
    actionType: ADMIN_ACTION_TYPE.CUSTOMER_STATUS_CHANGED,
    customerId,
    beforeState,
    afterState: mapCustomerManagementSummary(customer, profile),
    fallbackReason: reason,
  });

  return mapCustomerManagementSummary(customer, profile);
};

export const updateCustomerNotesForAdmin = async ({
  customerId,
  adminNotes,
  adminId,
  actorCityId,
  audit,
}: {
  customerId: string;
  adminNotes: string | null;
  adminId: string | null;
  actorCityId?: string | null;
  audit?: AuditContext;
}) => {
  const customer = await getCustomerOrThrow(customerId, actorCityId);
  const beforeProfile = await findCustomerAdminProfile(customerId);
  const beforeState = mapCustomerManagementSummary(customer, beforeProfile);
  const profile = await upsertCustomerAdminProfile({
    customerId,
    update: {
      adminNotes,
      updatedBy: adminId && Types.ObjectId.isValid(adminId)
        ? new Types.ObjectId(adminId)
        : null,
    },
  });

  await writeCustomerAudit({
    audit,
    actionType: ADMIN_ACTION_TYPE.CUSTOMER_NOTE_UPDATED,
    customerId,
    beforeState,
    afterState: mapCustomerManagementSummary(customer, profile),
    fallbackReason: 'Customer admin note updated',
  });

  return mapCustomerManagementSummary(customer, profile);
};

export const listCustomerOrdersForAdmin = async ({
  customerId,
  page,
  limit,
  status,
  fromDate,
  toDate,
  actorCityId,
}: {
  customerId: string;
  page: number;
  limit: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
  actorCityId?: string | null;
}) => {
  await getCustomerOrThrow(customerId, actorCityId);
  const { orders, total } = await listOrdersByAdmin({
    customerId,
    page,
    limit,
    status,
    fromDate: fromDate ? new Date(fromDate) : undefined,
    toDate: toDate ? new Date(toDate) : undefined,
  });

  return {
    items: orders.map(toAdminOrderListItemResponse),
    page,
    limit,
    total,
  };
};

export const listCustomerAddressesForAdmin = async (customerId: string, actorCityId?: string | null) => {
  await getCustomerOrThrow(customerId, actorCityId);
  const addresses = await findAddressesByCustomerId(customerId);

  return addresses.map((address) => ({
    addressId: address._id.toString(),
    label: address.label,
    line1: address.line1,
    line2: address.line2,
    landmark: address.landmark,
    city: address.city,
    cityId: address.cityId?.toString() ?? null,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    latitude: address.latitude,
    longitude: address.longitude,
    isDefault: address.isDefault,
    status: address.status,
    createdAt: address.createdAt.toISOString(),
    updatedAt: address.updatedAt.toISOString(),
  }));
};

export const listCustomerAuditForAdmin = async (customerId: string, actorCityId?: string | null) => {
  await getCustomerOrThrow(customerId, actorCityId);
  return AdminActionAuditModel.find({
    entityType: 'customer',
    entityId: new Types.ObjectId(customerId),
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean()
    .exec();
};
