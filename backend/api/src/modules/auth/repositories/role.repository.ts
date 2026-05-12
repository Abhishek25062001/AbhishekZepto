import { DB_STATUS } from '../../../database/constants/db-status.constants';
import { RoleModel, type RoleRecord } from '../models/role.model';

export type UpsertSystemRoleInput = Pick<RoleRecord, 'code' | 'name' | 'permissions'> &
  Partial<Pick<RoleRecord, 'description' | 'isSystemRole' | 'isEditable'>>;

export const findRoleByCode = (code: string) => {
  return RoleModel.findOne({
    code,
    isDeleted: false,
  });
};

export const listActiveRoles = () => {
  return RoleModel.find({
    status: DB_STATUS.ACTIVE,
    isDeleted: false,
  });
};

export const upsertSystemRole = (input: UpsertSystemRoleInput) => {
  return RoleModel.findOneAndUpdate(
    {
      code: input.code,
    },
    {
      $set: {
        name: input.name,
        description: input.description ?? null,
        permissions: input.permissions,
        isSystemRole: input.isSystemRole ?? true,
        isEditable: input.isEditable ?? false,
        status: DB_STATUS.ACTIVE,
        isDeleted: false,
        deletedAt: null,
      },
    },
    {
      new: true,
      setDefaultsOnInsert: true,
      upsert: true,
    },
  );
};
