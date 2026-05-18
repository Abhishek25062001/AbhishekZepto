import { Types } from 'mongoose';
import {
  UserIdentityModel,
  type UserIdentityRecord,
} from '../models/user-identity.model';
import type { AuthRole } from '../types/auth-role.types';

export type CreateUserIdentityInput = Pick<
  UserIdentityRecord,
  'phone' | 'role'
> &
  Partial<
    Pick<
      UserIdentityRecord,
      | 'email'
      | 'name'
      | 'accountStatus'
      | 'permissions'
      | 'vendorId'
      | 'storeId'
      | 'cityId'
      | 'createdBy'
      | 'updatedBy'
    >
  >;

export const findUserIdentityById = (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    return Promise.resolve(null);
  }

  return UserIdentityModel.findById(userId);
};

export const findUserIdentityByPhoneAndRole = (phone: string, role: AuthRole) => {
  return UserIdentityModel.findOne({
    phone,
    role,
    isDeleted: false,
  });
};

export const findActiveUserIdentityById = (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    return Promise.resolve(null);
  }

  return UserIdentityModel.findOne({
    _id: new Types.ObjectId(userId),
    isDeleted: false,
  });
};

export const findActiveUserIdentityByPhoneAndRole = (
  phone: string,
  role: AuthRole,
) => {
  return UserIdentityModel.findOne({
    phone,
    role,
    isDeleted: false,
  });
};

export const createUserIdentity = (input: CreateUserIdentityInput) => {
  return UserIdentityModel.create(input);
};

export const updateLastLoginAt = (userId: string) => {
  return UserIdentityModel.findByIdAndUpdate(
    new Types.ObjectId(userId),
    {
      lastLoginAt: new Date(),
    },
    {
      new: true,
    },
  );
};

export const updateUserPermissions = ({
  userId,
  permissions,
  updatedBy,
}: {
  userId: string;
  permissions: UserIdentityRecord['permissions'];
  updatedBy?: Types.ObjectId | null;
}) => {
  return UserIdentityModel.findOneAndUpdate(
    {
      _id: userId,
      isDeleted: false,
    },
    {
      $set: {
        permissions,
        updatedBy: updatedBy ?? null,
        updatedAt: new Date(),
      },
    },
    {
      new: true,
    },
  );
};

export const assignUserRole = ({
  userId,
  role,
  updatedBy,
}: {
  userId: string;
  role: AuthRole;
  updatedBy?: Types.ObjectId | null;
}) => {
  return UserIdentityModel.findOneAndUpdate(
    {
      _id: userId,
      isDeleted: false,
    },
    {
      $set: {
        role,
        updatedBy: updatedBy ?? null,
        updatedAt: new Date(),
      },
    },
    {
      new: true,
    },
  );
};
