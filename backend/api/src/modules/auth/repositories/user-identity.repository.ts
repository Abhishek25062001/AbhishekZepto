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
  return UserIdentityModel.findById(userId);
};

export const findUserIdentityByPhoneAndRole = (phone: string, role: AuthRole) => {
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
