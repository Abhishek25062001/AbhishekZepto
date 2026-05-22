import { Types } from 'mongoose';
import {
  CustomerAddressModel,
  type CustomerAddressRecord,
} from '../models/customer-address.model';

const notDeleted = { isDeleted: false };

export const findAddressesByCustomerId = async (
  customerId: string,
): Promise<(CustomerAddressRecord & { _id: Types.ObjectId })[]> => {
  if (!Types.ObjectId.isValid(customerId)) {
    return [];
  }

  return CustomerAddressModel.find({
    customerId: new Types.ObjectId(customerId),
    ...notDeleted,
  })
    .sort({ isDefault: -1, updatedAt: -1 })
    .lean();
};

export const findAddressByIdForCustomer = async (
  addressId: string,
  customerId: string,
): Promise<(CustomerAddressRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(addressId) || !Types.ObjectId.isValid(customerId)) {
    return null;
  }

  return CustomerAddressModel.findOne({
    _id: new Types.ObjectId(addressId),
    customerId: new Types.ObjectId(customerId),
    ...notDeleted,
  }).lean();
};

export const createAddress = async (
  payload: Partial<CustomerAddressRecord>,
): Promise<CustomerAddressRecord & { _id: Types.ObjectId }> => {
  const created = await CustomerAddressModel.create(payload);
  return created.toObject() as CustomerAddressRecord & { _id: Types.ObjectId };
};

export const updateAddressById = async (
  addressId: string,
  customerId: string,
  payload: Partial<CustomerAddressRecord>,
): Promise<(CustomerAddressRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(addressId) || !Types.ObjectId.isValid(customerId)) {
    return null;
  }

  return CustomerAddressModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(addressId),
      customerId: new Types.ObjectId(customerId),
      ...notDeleted,
    },
    { $set: payload },
    { new: true },
  ).lean();
};

export const softDeleteAddressById = async (
  addressId: string,
  customerId: string,
): Promise<(CustomerAddressRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(addressId) || !Types.ObjectId.isValid(customerId)) {
    return null;
  }

  return CustomerAddressModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(addressId),
      customerId: new Types.ObjectId(customerId),
      ...notDeleted,
    },
    { $set: { isDeleted: true, deletedAt: new Date(), isDefault: false } },
    { new: true },
  ).lean();
};

export const clearDefaultForCustomer = async (customerId: string): Promise<void> => {
  if (!Types.ObjectId.isValid(customerId)) {
    return;
  }

  await CustomerAddressModel.updateMany(
    { customerId: new Types.ObjectId(customerId), ...notDeleted, isDefault: true },
    { $set: { isDefault: false } },
  );
};
