import { DB_STATUS } from '../../../database/constants/db-status.constants';
import { RoleModel, type RoleRecord } from '../models/role.model';
import type { AuthRole } from '../types/auth-role.types';

export type UpsertSystemRoleInput = Pick<RoleRecord, 'code' | 'name' | 'permissions'> &
  Partial<Pick<RoleRecord, 'description' | 'isSystemRole' | 'isEditable'>>;

export const findRoleByCode = (code: AuthRole) => {
  return RoleModel.findOne({
    code,
    status: DB_STATUS.ACTIVE,
    isDeleted: false,
  });
};

export const findSystemRoleByCode = (code: AuthRole) => {
  return RoleModel.findOne({
    code,
    isSystemRole: true,
    status: DB_STATUS.ACTIVE,
    isDeleted: false,
  });
};

export const listActiveRoles = () => {
  return RoleModel.find({
    status: DB_STATUS.ACTIVE,
    isDeleted: false,
  });
};

export const listRoles = async ({
  page,
  limit,
  search,
  status,
}: {
  page: number;
  limit: number;
  search?: string;
  status?: RoleRecord['status'];
}) => {
  const filters: Record<string, unknown> = {
    isDeleted: false,
  };

  if (status) {
    filters.status = status;
  }

  if (search) {
    filters.$or = [
      {
        code: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        name: {
          $regex: search,
          $options: 'i',
        },
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    RoleModel.find(filters).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
    RoleModel.countDocuments(filters),
  ]);

  return {
    items,
    total,
  };
};

export const listActiveSystemRoles = () => {
  return RoleModel.find({
    isSystemRole: true,
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

export const findRoleById = (roleId: string) => {
  return RoleModel.findOne({
    _id: roleId,
    isDeleted: false,
  });
};

export const roleExistsByCode = (code: RoleRecord['code']) => {
  return RoleModel.exists({
    code,
    isDeleted: false,
  });
};

export const createRole = (
  input: Pick<
    RoleRecord,
    'code' | 'name' | 'description' | 'permissions' | 'isSystemRole' | 'isEditable'
  >,
) => {
  return RoleModel.create({
    ...input,
    status: DB_STATUS.ACTIVE,
    isDeleted: false,
    deletedAt: null,
  });
};

export const updateRoleById = (
  roleId: string,
  input: Partial<
    Pick<RoleRecord, 'name' | 'description' | 'permissions' | 'isEditable' | 'status'>
  >,
) => {
  return RoleModel.findOneAndUpdate(
    {
      _id: roleId,
      isDeleted: false,
    },
    {
      $set: input,
    },
    {
      new: true,
    },
  );
};

export const softDeleteRoleById = (roleId: string) => {
  return RoleModel.findOneAndUpdate(
    {
      _id: roleId,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        status: DB_STATUS.INACTIVE,
      },
    },
    {
      new: true,
    },
  );
};
