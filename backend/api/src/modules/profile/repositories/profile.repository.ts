import { Types } from 'mongoose';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import {
  UserIdentityModel,
  type UserIdentityRecord,
} from '../../auth/models/user-identity.model';

export type UpdateCustomerProfileFields = {
  name?: string | null;
  email?: string | null;
};

export const findCustomerProfileById = (customerId: string) => {
  if (!Types.ObjectId.isValid(customerId)) {
    return Promise.resolve(null);
  }

  return UserIdentityModel.findOne({
    _id: new Types.ObjectId(customerId),
    role: AUTH_ROLE.CUSTOMER,
    isDeleted: false,
  });
};

export const updateCustomerProfileById = (
  customerId: string,
  fields: UpdateCustomerProfileFields,
): Promise<UserIdentityRecord | null> => {
  if (!Types.ObjectId.isValid(customerId)) {
    return Promise.resolve(null);
  }

  const update: Record<string, string | null> = {};

  if (fields.name !== undefined) {
    update.name = fields.name;
  }

  if (fields.email !== undefined) {
    update.email = fields.email;
  }

  if (Object.keys(update).length === 0) {
    return findCustomerProfileById(customerId);
  }

  return UserIdentityModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(customerId),
      role: AUTH_ROLE.CUSTOMER,
      isDeleted: false,
    },
    {
      $set: {
        ...update,
        updatedAt: new Date(),
      },
    },
    { new: true },
  );
};
