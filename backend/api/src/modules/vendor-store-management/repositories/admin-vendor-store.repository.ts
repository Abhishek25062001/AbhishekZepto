import { Types } from 'mongoose';

import { AdminActionAuditModel } from '../../admin-control/models/admin-action-audit.model';
import type { AdminActionAuditRecord } from '../../admin-control/types/admin-action-audit.types';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import { UserIdentityModel, type UserIdentityRecord } from '../../auth/models/user-identity.model';
import { InventoryStockModel, type InventoryStockRecord } from '../../inventory/models/inventory-stock.model';
import { StoreModel, type StoreRecord } from '../../stores/models/store.model';
import type {
  ListAdminStoresInput,
  ListAdminVendorsInput,
  StoreManagementStatus,
  VendorManagementStatus,
} from '../types/admin-vendor-store-management.types';

export type VendorIdentityRecord = UserIdentityRecord & { _id: Types.ObjectId };
export type AdminStoreRecord = StoreRecord & { _id: Types.ObjectId };
export type AdminInventoryStockRecord = InventoryStockRecord & { _id: Types.ObjectId };

const vendorRoles = [
  AUTH_ROLE.VENDOR_OWNER,
  AUTH_ROLE.STORE_MANAGER,
  AUTH_ROLE.STORE_STAFF,
] as const;

const notDeletedFilter = { isDeleted: false };
const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const listAdminVendorGroups = async ({
  status,
  cityId,
  search,
  page,
  limit,
}: ListAdminVendorsInput): Promise<{ items: VendorIdentityRecord[][]; total: number }> => {
  const baseFilter: Record<string, unknown> = {
    role: { $in: vendorRoles },
    vendorId: { $ne: null },
    ...notDeletedFilter,
  };

  if (status) {
    baseFilter.accountStatus = status;
  }

  if (cityId && Types.ObjectId.isValid(cityId)) {
    baseFilter.cityId = new Types.ObjectId(cityId);
  }

  if (search?.trim()) {
    const pattern = escapeRegex(search.trim());
    baseFilter.$or = [
      { name: { $regex: pattern, $options: 'i' } },
      { phone: { $regex: pattern, $options: 'i' } },
      { email: { $regex: pattern, $options: 'i' } },
    ];
  }

  const vendorIds = await UserIdentityModel.distinct('vendorId', baseFilter);
  const filteredVendorIds = vendorIds.filter((vendorId): vendorId is Types.ObjectId =>
    vendorId instanceof Types.ObjectId,
  );
  const total = filteredVendorIds.length;
  const pageVendorIds = filteredVendorIds.slice((page - 1) * limit, page * limit);

  const items = await Promise.all(
    pageVendorIds.map((vendorId) =>
      UserIdentityModel.find({
        ...baseFilter,
        vendorId,
      })
        .sort({ role: 1, createdAt: 1 })
        .lean()
        .exec() as Promise<VendorIdentityRecord[]>,
    ),
  );

  return { items, total };
};

export const findAdminVendorGroupById = async (
  vendorId: string,
): Promise<VendorIdentityRecord[] | null> => {
  if (!Types.ObjectId.isValid(vendorId)) {
    return null;
  }

  const items = await UserIdentityModel.find({
    role: { $in: vendorRoles },
    vendorId: new Types.ObjectId(vendorId),
    ...notDeletedFilter,
  })
    .sort({ role: 1, createdAt: 1 })
    .lean()
    .exec() as VendorIdentityRecord[];

  return items.length > 0 ? items : null;
};

export const countStoresForVendor = (vendorId: string): Promise<number> => {
  if (!Types.ObjectId.isValid(vendorId)) {
    return Promise.resolve(0);
  }

  return StoreModel.countDocuments({
    vendorId: new Types.ObjectId(vendorId),
    ...notDeletedFilter,
  }).exec();
};

export const listAdminStores = async ({
  status,
  vendorId,
  cityId,
  search,
  page,
  limit,
}: ListAdminStoresInput): Promise<{ items: AdminStoreRecord[]; total: number }> => {
  const filter: Record<string, unknown> = { ...notDeletedFilter };

  if (status) {
    filter.status = status;
  }

  if (vendorId && Types.ObjectId.isValid(vendorId)) {
    filter.vendorId = new Types.ObjectId(vendorId);
  }

  if (cityId && Types.ObjectId.isValid(cityId)) {
    filter.cityId = new Types.ObjectId(cityId);
  }

  if (search?.trim()) {
    const pattern = escapeRegex(search.trim());
    filter.$or = [
      { name: { $regex: pattern, $options: 'i' } },
      { slug: { $regex: pattern, $options: 'i' } },
      { code: { $regex: pattern, $options: 'i' } },
      { phone: { $regex: pattern, $options: 'i' } },
      { email: { $regex: pattern, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    StoreModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
    StoreModel.countDocuments(filter).exec(),
  ]);

  return { items: items as AdminStoreRecord[], total };
};

export const findAdminStoreById = async (storeId: string): Promise<AdminStoreRecord | null> => {
  if (!Types.ObjectId.isValid(storeId)) {
    return null;
  }

  return StoreModel.findOne({
    _id: new Types.ObjectId(storeId),
    ...notDeletedFilter,
  })
    .lean()
    .exec() as Promise<AdminStoreRecord | null>;
};

export const updateAdminVendorStatus = async ({
  vendorId,
  status,
}: {
  vendorId: string;
  status: VendorManagementStatus;
}): Promise<VendorIdentityRecord[] | null> => {
  if (!Types.ObjectId.isValid(vendorId)) {
    return null;
  }

  const vendorObjectId = new Types.ObjectId(vendorId);
  await UserIdentityModel.updateMany(
    {
      role: { $in: vendorRoles },
      vendorId: vendorObjectId,
      ...notDeletedFilter,
    },
    { $set: { accountStatus: status } },
  ).exec();

  return findAdminVendorGroupById(vendorId);
};

export const updateAdminStoreStatus = async ({
  storeId,
  status,
}: {
  storeId: string;
  status: StoreManagementStatus;
}): Promise<AdminStoreRecord | null> => {
  if (!Types.ObjectId.isValid(storeId)) {
    return null;
  }

  return StoreModel.findOneAndUpdate(
    { _id: new Types.ObjectId(storeId), ...notDeletedFilter },
    { $set: { status } },
    { new: true, runValidators: true },
  )
    .lean()
    .exec() as Promise<AdminStoreRecord | null>;
};

export const listAdminStoreInventory = async ({
  storeId,
  page,
  limit,
}: {
  storeId: string;
  page: number;
  limit: number;
}): Promise<{ items: AdminInventoryStockRecord[]; total: number }> => {
  if (!Types.ObjectId.isValid(storeId)) {
    return { items: [], total: 0 };
  }

  const filter = {
    storeId: new Types.ObjectId(storeId),
    ...notDeletedFilter,
  };
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    InventoryStockModel.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean().exec(),
    InventoryStockModel.countDocuments(filter).exec(),
  ]);

  return { items: items as AdminInventoryStockRecord[], total };
};

export const listAdminStoreAudit = async ({
  storeId,
  page,
  limit,
}: {
  storeId: string;
  page: number;
  limit: number;
}): Promise<{ items: AdminActionAuditRecord[]; total: number }> => {
  if (!Types.ObjectId.isValid(storeId)) {
    return { items: [], total: 0 };
  }

  const filter = {
    entityType: 'store',
    entityId: new Types.ObjectId(storeId),
  };
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    AdminActionAuditModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
    AdminActionAuditModel.countDocuments(filter).exec(),
  ]);

  return { items, total };
};
