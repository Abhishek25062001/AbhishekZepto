import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import type { DbStatus } from '../../../database/constants/db-status.constants';
import type { PermissionCode } from '../types/auth-permission.types';
import type { AuthRole } from '../types/auth-role.types';

export type RoleRecord = {
  code: AuthRole;
  name: string;
  description: string | null;
  permissions: PermissionCode[];
  isSystemRole: boolean;
  isEditable: boolean;
  status: DbStatus;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const RoleSchema = new Schema<RoleRecord>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
      trim: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
    isSystemRole: {
      type: Boolean,
      default: true,
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
    ...baseSchemaFields,
  },
  baseSchemaOptions as SchemaOptions<RoleRecord>,
);

RoleSchema.index({ code: 1 }, { unique: true });

export const RoleModel = model<RoleRecord>('Role', RoleSchema, COLLECTION_NAMES.ROLES);
