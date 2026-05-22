import { Types } from 'mongoose';
import {
  CustomerStoreSelectionModel,
  type CustomerStoreSelectionRecord,
} from '../models/customer-store-selection.model';

export const clearSelectedForCustomer = async (customerId: string): Promise<void> => {
  if (!Types.ObjectId.isValid(customerId)) {
    return;
  }

  await CustomerStoreSelectionModel.updateMany(
    { customerId: new Types.ObjectId(customerId), isSelected: true },
    { $set: { isSelected: false } },
  );
};

export const upsertSelectedStore = async (payload: {
  customerId: string;
  addressId: string;
  storeId: string;
}): Promise<CustomerStoreSelectionRecord & { _id: Types.ObjectId }> => {
  const customerObjectId = new Types.ObjectId(payload.customerId);
  const addressObjectId = new Types.ObjectId(payload.addressId);
  const storeObjectId = new Types.ObjectId(payload.storeId);

  await clearSelectedForCustomer(payload.customerId);

  const existing = await CustomerStoreSelectionModel.findOne({
    customerId: customerObjectId,
    addressId: addressObjectId,
    storeId: storeObjectId,
  }).lean();

  if (existing) {
    const updated = await CustomerStoreSelectionModel.findByIdAndUpdate(
      existing._id,
      { $set: { isSelected: true } },
      { new: true },
    ).lean();

    return updated as CustomerStoreSelectionRecord & { _id: Types.ObjectId };
  }

  const created = await CustomerStoreSelectionModel.create({
    customerId: customerObjectId,
    addressId: addressObjectId,
    storeId: storeObjectId,
    isSelected: true,
  });

  return created.toObject() as CustomerStoreSelectionRecord & { _id: Types.ObjectId };
};

export const findSelectedStoreByCustomerId = async (
  customerId: string,
): Promise<(CustomerStoreSelectionRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(customerId)) {
    return null;
  }

  return CustomerStoreSelectionModel.findOne({
    customerId: new Types.ObjectId(customerId),
    isSelected: true,
  }).lean();
};
