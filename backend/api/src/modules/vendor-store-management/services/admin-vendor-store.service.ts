import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { ADMIN_ACTION_TYPE } from '../../admin-control/constants/admin-action-types';
import { writeAdminActionAudit } from '../../admin-control/services/admin-audit-log.service';
import { listOrdersByAdmin } from '../../orders/repositories/order.repository';
import { toAdminOrderListItemResponse } from '../../orders/utils/order-response.mapper';
import {
  countStoresForVendor,
  findAdminStoreById,
  findAdminVendorGroupById,
  listAdminStoreAudit,
  listAdminStoreInventory,
  listAdminStores,
  listAdminVendorGroups,
  updateAdminStoreStatus,
  updateAdminVendorStatus,
} from '../repositories/admin-vendor-store.repository';
import type {
  ListAdminStoresInput,
  ListAdminVendorsInput,
  PaginatedAdminStores,
  PaginatedAdminVendors,
  PaginatedAdminStoreInspection,
  AdminStoreAuditSummary,
  AdminStoreInventorySummary,
  StoreManagementStatus,
  StoreInspectionInput,
  VendorManagementStatus,
} from '../types/admin-vendor-store-management.types';
import {
  mapAdminStoreAuditSummary,
  mapAdminStoreInventorySummary,
  mapAdminStoreSummary,
  mapAdminVendorSummary,
} from './admin-vendor-store.mapper';

type AuditContext = {
  actorAdminId: string | null;
  reason?: string | null;
  ipAddress?: string | null;
  deviceInfo?: string | null;
};

const normalizeId = (value?: { toString: () => string } | string | null): string | null =>
  value ? value.toString() : null;

const writeVendorStoreAudit = async ({
  audit,
  actionType,
  entityType,
  entityId,
  beforeState,
  afterState,
  fallbackReason,
}: {
  audit?: AuditContext;
  actionType: typeof ADMIN_ACTION_TYPE[keyof typeof ADMIN_ACTION_TYPE];
  entityType: 'vendor' | 'store';
  entityId: string;
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
    entityType,
    entityId,
    beforeState,
    afterState,
    reason: audit.reason ?? fallbackReason,
    ipAddress: audit.ipAddress ?? null,
    deviceInfo: audit.deviceInfo ?? null,
  });
};

const throwScopeDenied = (message: string) => {
  throw new AppError({
    message,
    statusCode: HTTP_STATUS.FORBIDDEN,
    errorCode: ERROR_CODES.INVALID_ADMIN_SCOPE,
  });
};

const assertStoreCityScope = (
  storeCityId: { toString: () => string } | string | null | undefined,
  actorCityId?: string | null,
) => {
  if (!actorCityId) {
    return;
  }

  if (normalizeId(storeCityId) !== actorCityId) {
    throwScopeDenied('Store is outside the admin city scope');
  }
};

const assertVendorCityScope = (
  identities: Array<{ cityId?: { toString: () => string } | string | null }>,
  actorCityId?: string | null,
) => {
  if (!actorCityId) {
    return;
  }

  if (!identities.some((identity) => normalizeId(identity.cityId) === actorCityId)) {
    throwScopeDenied('Vendor is outside the admin city scope');
  }
};

export const listVendorsForAdmin = async (
  input: ListAdminVendorsInput,
): Promise<PaginatedAdminVendors> => {
  if (input.actorCityId && input.cityId && input.cityId !== input.actorCityId) {
    throwScopeDenied('Vendor list city filter is outside the admin city scope');
  }

  const { actorCityId, ...filters } = input;
  const { items, total } = await listAdminVendorGroups({
    ...filters,
    cityId: actorCityId ?? filters.cityId,
  });
  const mapped = await Promise.all(
    items.map(async (identities) => mapAdminVendorSummary({
      identities,
      storeCount: await countStoresForVendor(identities[0]?.vendorId?.toString() ?? ''),
    })),
  );

  return {
    items: mapped,
    page: input.page,
    limit: input.limit,
    total,
  };
};

export const getVendorForAdmin = async (vendorId: string, actorCityId?: string | null) => {
  const identities = await findAdminVendorGroupById(vendorId);

  if (!identities) {
    throw new AppError({
      message: 'Vendor not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.NOT_FOUND,
    });
  }

  assertVendorCityScope(identities, actorCityId);

  return mapAdminVendorSummary({
    identities,
    storeCount: await countStoresForVendor(vendorId),
  });
};

export const listStoresForAdmin = async (
  input: ListAdminStoresInput,
): Promise<PaginatedAdminStores> => {
  if (input.actorCityId && input.cityId && input.cityId !== input.actorCityId) {
    throwScopeDenied('Store list city filter is outside the admin city scope');
  }

  const { actorCityId, ...filters } = input;
  const { items, total } = await listAdminStores({
    ...filters,
    cityId: actorCityId ?? filters.cityId,
  });

  return {
    items: items.map(mapAdminStoreSummary),
    page: input.page,
    limit: input.limit,
    total,
  };
};

export const getStoreForAdmin = async (storeId: string, actorCityId?: string | null) => {
  const store = await findAdminStoreById(storeId);

  if (!store) {
    throw new AppError({
      message: 'Store not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.STORE_NOT_FOUND,
    });
  }

  assertStoreCityScope(store.cityId, actorCityId);

  return mapAdminStoreSummary(store);
};

export const updateVendorStatusForAdmin = async ({
  vendorId,
  status,
  reason,
  actorCityId,
  audit,
}: {
  vendorId: string;
  status: VendorManagementStatus;
  reason: string;
  adminId: string | null;
  actorCityId?: string | null;
  audit?: AuditContext;
}) => {
  const existing = await findAdminVendorGroupById(vendorId);

  if (!existing) {
    throw new AppError({
      message: 'Vendor not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.NOT_FOUND,
    });
  }

  assertVendorCityScope(existing, actorCityId);

  const storeCount = await countStoresForVendor(vendorId);
  const beforeState = mapAdminVendorSummary({ identities: existing, storeCount });
  const identities = await updateAdminVendorStatus({ vendorId, status });

  if (!identities) {
    throw new AppError({
      message: 'Vendor not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.NOT_FOUND,
    });
  }

  const afterState = mapAdminVendorSummary({ identities, storeCount });
  await writeVendorStoreAudit({
    audit,
    actionType: ADMIN_ACTION_TYPE.VENDOR_STATUS_CHANGED,
    entityType: 'vendor',
    entityId: vendorId,
    beforeState: { ...beforeState },
    afterState: { ...afterState },
    fallbackReason: reason,
  });

  return afterState;
};

export const updateStoreStatusForAdmin = async ({
  storeId,
  status,
  reason,
  actorCityId,
  audit,
}: {
  storeId: string;
  status: StoreManagementStatus;
  reason: string;
  adminId: string | null;
  actorCityId?: string | null;
  audit?: AuditContext;
}) => {
  const beforeState = await getStoreForAdmin(storeId, actorCityId);
  const store = await updateAdminStoreStatus({ storeId, status });

  if (!store) {
    throw new AppError({
      message: 'Store not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.STORE_NOT_FOUND,
    });
  }

  const afterState = mapAdminStoreSummary(store);
  await writeVendorStoreAudit({
    audit,
    actionType: ADMIN_ACTION_TYPE.STORE_STATUS_CHANGED,
    entityType: 'store',
    entityId: storeId,
    beforeState: { ...beforeState },
    afterState: { ...afterState },
    fallbackReason: reason,
  });

  return afterState;
};

export const listStoreOrdersForAdmin = async ({
  storeId,
  actorCityId,
  page,
  limit,
}: StoreInspectionInput) => {
  await getStoreForAdmin(storeId, actorCityId);
  const { orders, total } = await listOrdersByAdmin({ storeId, page, limit });

  return {
    items: orders.map(toAdminOrderListItemResponse),
    page,
    limit,
    total,
  };
};

export const listStoreInventoryForAdmin = async ({
  storeId,
  actorCityId,
  page,
  limit,
}: StoreInspectionInput): Promise<PaginatedAdminStoreInspection<AdminStoreInventorySummary>> => {
  await getStoreForAdmin(storeId, actorCityId);
  const { items, total } = await listAdminStoreInventory({ storeId, page, limit });

  return {
    items: items.map(mapAdminStoreInventorySummary),
    page,
    limit,
    total,
  };
};

export const listStoreAuditForAdmin = async ({
  storeId,
  actorCityId,
  page,
  limit,
}: StoreInspectionInput): Promise<PaginatedAdminStoreInspection<AdminStoreAuditSummary>> => {
  await getStoreForAdmin(storeId, actorCityId);
  const { items, total } = await listAdminStoreAudit({ storeId, page, limit });

  return {
    items: items.map(mapAdminStoreAuditSummary),
    page,
    limit,
    total,
  };
};
