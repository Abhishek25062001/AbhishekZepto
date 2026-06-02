import type { AdminActionAuditRecord } from '../../admin-control/types/admin-action-audit.types';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import type {
  AdminInventoryStockRecord,
  AdminStoreRecord,
  VendorIdentityRecord,
} from '../repositories/admin-vendor-store.repository';
import type {
  AdminStoreAuditSummary,
  AdminStoreInventorySummary,
  AdminStoreSummary,
  AdminVendorSummary,
} from '../types/admin-vendor-store-management.types';

const toId = (value?: { toString: () => string } | null): string | null =>
  value ? value.toString() : null;

const toIso = (date?: Date | null): string | null => date ? date.toISOString() : null;

export const mapAdminStoreSummary = (store: AdminStoreRecord): AdminStoreSummary => ({
  storeId: store._id.toString(),
  vendorId: store.vendorId.toString(),
  cityId: store.cityId.toString(),
  serviceAreaIds: store.serviceAreaIds.map((serviceAreaId) => serviceAreaId.toString()),
  name: store.name,
  slug: store.slug,
  code: store.code,
  description: store.description,
  phone: store.phone,
  email: store.email,
  addressLine1: store.addressLine1,
  addressLine2: store.addressLine2,
  landmark: store.landmark,
  pincode: store.pincode,
  latitude: store.latitude,
  longitude: store.longitude,
  serviceRadiusKm: store.serviceRadiusKm,
  openingTime: store.openingTime,
  closingTime: store.closingTime,
  operatingDays: store.operatingDays,
  isOpen: store.isOpen,
  isAcceptingOrders: store.isAcceptingOrders,
  temporaryClosureReason: store.temporaryClosureReason,
  storeType: store.storeType,
  fulfillmentType: store.fulfillmentType,
  status: store.status,
  createdAt: store.createdAt.toISOString(),
  updatedAt: store.updatedAt.toISOString(),
});

export const mapAdminVendorSummary = ({
  identities,
  storeCount,
}: {
  identities: VendorIdentityRecord[];
  storeCount: number;
}): AdminVendorSummary => {
  const primary = identities.find((identity) => identity.role === AUTH_ROLE.VENDOR_OWNER)
    ?? identities[0];

  if (!primary) {
    return {
      vendorId: '',
      primaryVendorUserId: null,
      name: null,
      phone: null,
      email: null,
      accountStatus: null,
      cityId: null,
      storeId: null,
      userCount: 0,
      storeCount,
      createdAt: null,
      updatedAt: null,
    };
  }

  return {
    vendorId: primary.vendorId?.toString() ?? '',
    primaryVendorUserId: primary._id.toString(),
    name: primary.name,
    phone: primary.phone,
    email: primary.email,
    accountStatus: primary.accountStatus,
    cityId: toId(primary.cityId),
    storeId: toId(primary.storeId),
    userCount: identities.length,
    storeCount,
    createdAt: toIso(primary.createdAt),
    updatedAt: toIso(primary.updatedAt),
  };
};

export const mapAdminStoreInventorySummary = (
  stock: AdminInventoryStockRecord,
): AdminStoreInventorySummary => ({
  inventoryStockId: stock._id.toString(),
  storeId: stock.storeId.toString(),
  vendorId: stock.vendorId.toString(),
  cityId: stock.cityId.toString(),
  storeProductId: stock.storeProductId.toString(),
  productId: stock.productId.toString(),
  variantId: stock.variantId.toString(),
  sku: stock.sku,
  storeSku: stock.storeSku,
  availableQuantity: stock.availableQuantity,
  reservedQuantity: stock.reservedQuantity,
  damagedQuantity: stock.damagedQuantity,
  expiredQuantity: stock.expiredQuantity,
  totalQuantity: stock.totalQuantity,
  lowStockThreshold: stock.lowStockThreshold,
  reorderLevel: stock.reorderLevel,
  isLowStock: stock.isLowStock,
  isOutOfStock: stock.isOutOfStock,
  status: stock.status,
  updatedAt: stock.updatedAt.toISOString(),
});

export const mapAdminStoreAuditSummary = (
  audit: AdminActionAuditRecord & { _id?: { toString: () => string } },
): AdminStoreAuditSummary => ({
  auditId: audit._id?.toString() ?? '',
  adminId: audit.adminId.toString(),
  actionType: audit.actionType,
  entityType: audit.entityType,
  entityId: audit.entityId.toString(),
  beforeState: audit.beforeState,
  afterState: audit.afterState,
  reason: audit.reason,
  ipAddress: audit.ipAddress,
  deviceInfo: audit.deviceInfo,
  createdAt: audit.createdAt.toISOString(),
});
