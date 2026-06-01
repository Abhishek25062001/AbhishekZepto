import { Types } from 'mongoose';

import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import { UserIdentityModel } from '../../auth/models/user-identity.model';
import { CustomerAdminProfileModel } from '../models/customer-admin-profile.model';
import type { ListCustomersInput } from '../types/customer-management.types';

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const findCustomerIdentityById = (customerId: string) => {
  if (!Types.ObjectId.isValid(customerId)) {
    return Promise.resolve(null);
  }

  return UserIdentityModel.findOne({
    _id: new Types.ObjectId(customerId),
    role: AUTH_ROLE.CUSTOMER,
    isDeleted: false,
  }).exec();
};

export const findCustomerAdminProfile = (customerId: string) => {
  if (!Types.ObjectId.isValid(customerId)) {
    return Promise.resolve(null);
  }

  return CustomerAdminProfileModel.findOne({
    customerId: new Types.ObjectId(customerId),
  }).exec();
};

export const upsertCustomerAdminProfile = ({
  customerId,
  update,
}: {
  customerId: string;
  update: Record<string, unknown>;
}) => {
  return CustomerAdminProfileModel.findOneAndUpdate(
    { customerId: new Types.ObjectId(customerId) },
    { $set: update },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).exec();
};

export const listCustomerIdentities = async ({
  status,
  cityId,
  search,
  createdFrom,
  createdTo,
  page,
  limit,
}: ListCustomersInput) => {
  const filter: Record<string, unknown> = {
    role: AUTH_ROLE.CUSTOMER,
    isDeleted: false,
  };

  if (status) {
    filter.accountStatus = status;
  }

  if (cityId && Types.ObjectId.isValid(cityId)) {
    filter.cityId = new Types.ObjectId(cityId);
  }

  if (search?.trim()) {
    const pattern = escapeRegex(search.trim());
    filter.$or = [
      { name: { $regex: pattern, $options: 'i' } },
      { phone: { $regex: pattern, $options: 'i' } },
      { email: { $regex: pattern, $options: 'i' } },
    ];
  }

  if (createdFrom || createdTo) {
    filter.createdAt = {
      ...(createdFrom ? { $gte: new Date(createdFrom) } : {}),
      ...(createdTo ? { $lte: new Date(createdTo) } : {}),
    };
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    UserIdentityModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
    UserIdentityModel.countDocuments(filter).exec(),
  ]);

  return { items, total };
};
