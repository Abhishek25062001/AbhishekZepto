import { Types } from 'mongoose';

import {
  UserIdentityModel,
  type UserIdentityRecord,
} from '../../auth/models/user-identity.model';
import type { AuthRole } from '../../auth/types/auth-role.types';
import { ADMIN_USER_MANAGED_ROLES } from '../constants/admin-user.constants';
import type {
  CreateAdminUserInput,
  ListAdminUsersInput,
  UpdateAdminUserInput,
} from '../types/admin-user.types';

const toObjectIdOrNull = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }

  return new Types.ObjectId(value);
};

const toObjectIdArray = (values?: string[]): Types.ObjectId[] => {
  return (values ?? [])
    .filter((value) => Types.ObjectId.isValid(value))
    .map((value) => new Types.ObjectId(value));
};

export const createAdminUserIdentity = (input: CreateAdminUserInput) => {
  return UserIdentityModel.create({
    phone: input.phone,
    email: input.email ?? null,
    name: input.name ?? null,
    role: input.role,
    permissions: input.permissions ?? [],
    accountStatus: input.status ?? 'active',
    cityId: toObjectIdArray(input.cityScope)[0] ?? null,
    storeId: toObjectIdArray(input.storeScope)[0] ?? null,
    vendorId: null,
    createdBy: toObjectIdOrNull(input.createdBy),
    updatedBy: toObjectIdOrNull(input.createdBy),
  });
};

export const findAdminUserById = (adminUserId: string) => {
  if (!Types.ObjectId.isValid(adminUserId)) {
    return Promise.resolve(null);
  }

  return UserIdentityModel.findOne({
    _id: new Types.ObjectId(adminUserId),
    role: { $in: ADMIN_USER_MANAGED_ROLES },
    isDeleted: false,
  });
};

export const findAdminUserByPhone = (phone: string, role?: AuthRole) => {
  return UserIdentityModel.findOne({
    phone,
    ...(role ? { role } : { role: { $in: ADMIN_USER_MANAGED_ROLES } }),
    isDeleted: false,
  });
};

export const listAdminUsers = async ({
  role,
  status,
  cityId,
  search,
  page,
  limit,
}: ListAdminUsersInput): Promise<{
  items: Array<UserIdentityRecord & { _id: Types.ObjectId }>;
  total: number;
}> => {
  const filter: Record<string, unknown> = {
    role: role ?? { $in: ADMIN_USER_MANAGED_ROLES },
    isDeleted: false,
  };

  if (status) {
    filter.accountStatus = status;
  }

  if (cityId && Types.ObjectId.isValid(cityId)) {
    filter.cityId = new Types.ObjectId(cityId);
  }

  if (search?.trim()) {
    const pattern = search.trim();
    filter.$or = [
      { name: { $regex: pattern, $options: 'i' } },
      { email: { $regex: pattern, $options: 'i' } },
      { phone: { $regex: pattern, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    UserIdentityModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    UserIdentityModel.countDocuments(filter).exec(),
  ]);

  return { items, total };
};

export const updateAdminUserIdentity = ({
  adminUserId,
  input,
}: {
  adminUserId: string;
  input: UpdateAdminUserInput;
}) => {
  const update: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (input.name !== undefined) {
    update.name = input.name;
  }

  if (input.email !== undefined) {
    update.email = input.email;
  }

  if (input.phone !== undefined) {
    update.phone = input.phone;
  }

  if (input.cityScope !== undefined) {
    update.cityId = toObjectIdArray(input.cityScope)[0] ?? null;
  }

  if (input.storeScope !== undefined) {
    update.storeId = toObjectIdArray(input.storeScope)[0] ?? null;
  }

  if (input.updatedBy !== undefined) {
    update.updatedBy = toObjectIdOrNull(input.updatedBy);
  }

  return UserIdentityModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(adminUserId),
      role: { $in: ADMIN_USER_MANAGED_ROLES },
      isDeleted: false,
    },
    { $set: update },
    { new: true },
  ).exec();
};
