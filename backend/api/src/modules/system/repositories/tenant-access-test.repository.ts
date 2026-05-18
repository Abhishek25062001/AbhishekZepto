import {
  buildIsNotDeletedFilter,
  buildTenantScopeFilter,
} from '../../../database';
import {
  TenantAccessTestModel,
  type TenantAccessTestRecord,
} from '../models/tenant-access-test.model';

export type CreateTenantAccessTestInput = {
  vendorId?: string | null;
  storeId?: string | null;
  cityId?: string | null;
  customerId?: string | null;
  deliveryAgentId?: string | null;
  label: string;
};

export const createTenantAccessTestRecord = async (
  input: CreateTenantAccessTestInput,
): Promise<TenantAccessTestRecord> => {
  const record = await TenantAccessTestModel.create({
    vendorId: input.vendorId ?? null,
    storeId: input.storeId ?? null,
    cityId: input.cityId ?? null,
    customerId: input.customerId ?? null,
    deliveryAgentId: input.deliveryAgentId ?? null,
    label: input.label,
    status: 'active',
    isDeleted: false,
    deletedAt: null,
  });

  return record;
};

export const upsertTenantAccessTestRecordByLabel = async (
  input: CreateTenantAccessTestInput,
): Promise<TenantAccessTestRecord> => {
  const record = await TenantAccessTestModel.findOneAndUpdate(
    {
      label: input.label,
    },
    {
      $set: {
        vendorId: input.vendorId ?? null,
        storeId: input.storeId ?? null,
        cityId: input.cityId ?? null,
        customerId: input.customerId ?? null,
        deliveryAgentId: input.deliveryAgentId ?? null,
        status: 'active',
        isDeleted: false,
        deletedAt: null,
      },
    },
    {
      new: true,
      setDefaultsOnInsert: true,
      upsert: true,
    },
  ).orFail();

  return record;
};

export const findTenantAccessTestsByVendorStore = async ({
  vendorId,
  storeId,
}: {
  vendorId: string;
  storeId: string;
}): Promise<TenantAccessTestRecord[]> => {
  return TenantAccessTestModel.find({
    ...buildIsNotDeletedFilter(),
    ...buildTenantScopeFilter({
      vendorId,
      storeId,
    }),
  })
    .sort({ createdAt: -1 })
    .exec();
};

export const findTenantAccessTestsByCustomer = async ({
  customerId,
}: {
  customerId: string;
}): Promise<TenantAccessTestRecord[]> => {
  return TenantAccessTestModel.find({
    ...buildIsNotDeletedFilter(),
    ...buildTenantScopeFilter({
      customerId,
    }),
  })
    .sort({ createdAt: -1 })
    .exec();
};

export const findTenantAccessTestsByDeliveryAgent = async ({
  deliveryAgentId,
}: {
  deliveryAgentId: string;
}): Promise<TenantAccessTestRecord[]> => {
  return TenantAccessTestModel.find({
    ...buildIsNotDeletedFilter(),
    ...buildTenantScopeFilter({
      deliveryAgentId,
    }),
  })
    .sort({ createdAt: -1 })
    .exec();
};
