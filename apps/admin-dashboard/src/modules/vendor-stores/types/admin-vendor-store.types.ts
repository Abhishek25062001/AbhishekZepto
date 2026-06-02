import type { ApiPaginationMeta } from '../../../types/api.types';

export type VendorManagementStatus =
  | 'active'
  | 'inactive'
  | 'blocked'
  | 'suspended'
  | 'pending_approval';

export type StoreManagementStatus = 'active' | 'inactive' | 'suspended' | 'archived';

export type AdminVendorSummary = {
  vendorId: string;
  primaryVendorUserId: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  accountStatus: string | null;
  cityId: string | null;
  storeId: string | null;
  userCount: number;
  storeCount: number;
  createdAt: string | null;
  updatedAt: string | null;
};

export type AdminStoreSummary = {
  storeId: string;
  vendorId: string;
  cityId: string;
  serviceAreaIds: string[];
  name: string;
  slug: string;
  code: string;
  description: string | null;
  phone: string;
  email: string | null;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  pincode: string;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  openingTime: string;
  closingTime: string;
  operatingDays: string[];
  isOpen: boolean;
  isAcceptingOrders: boolean;
  temporaryClosureReason: string | null;
  storeType: string;
  fulfillmentType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminVendorListQuery = {
  status?: VendorManagementStatus;
  cityId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type AdminStoreListQuery = {
  status?: StoreManagementStatus;
  vendorId?: string;
  cityId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type PaginatedAdminVendors = {
  items: AdminVendorSummary[];
  page: number;
  limit: number;
  total: number;
};

export type PaginatedAdminStores = {
  items: AdminStoreSummary[];
  page: number;
  limit: number;
  total: number;
};

export type AdminVendorListResult = {
  items: AdminVendorSummary[];
  pagination: ApiPaginationMeta;
};

export type AdminStoreListResult = {
  items: AdminStoreSummary[];
  pagination: ApiPaginationMeta;
};

export type AdminStoreOrderSummary = {
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  storeStatus: string;
  pickerStatus: string | null;
  packingStatus: string | null;
  grandTotal: number;
  currency: string;
  placedAt: string;
  itemCount: number;
  customerId: string;
  storeId: string;
  paymentStatus: string;
  createdAt: string;
  acceptedAt: string | null;
  slaStatus: string;
  slaBreachedStage: string | null;
  cityId: string | null;
};

export type AdminStoreInventorySummary = {
  inventoryStockId: string;
  storeId: string;
  vendorId: string;
  cityId: string;
  storeProductId: string;
  productId: string;
  variantId: string;
  sku: string;
  storeSku: string | null;
  availableQuantity: number;
  reservedQuantity: number;
  damagedQuantity: number;
  expiredQuantity: number;
  totalQuantity: number;
  lowStockThreshold: number;
  reorderLevel: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  status: string;
  updatedAt: string;
};

export type AdminStoreAuditSummary = {
  auditId: string;
  adminId: string;
  actionType: string;
  entityType: string;
  entityId: string;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  reason: string;
  ipAddress: string | null;
  deviceInfo: string | null;
  createdAt: string;
};

export type AdminStoreInspectionQuery = {
  page?: number;
  limit?: number;
};

export type PaginatedAdminStoreInspection<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};

export type AdminStoreInspectionResult<T> = {
  items: T[];
  pagination: ApiPaginationMeta;
};

export type VendorStatusPayload = {
  status: VendorManagementStatus;
  reason: string;
};

export type StoreStatusPayload = {
  status: StoreManagementStatus;
  reason: string;
};
