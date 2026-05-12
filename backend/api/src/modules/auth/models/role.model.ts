import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';

export type RoleRecord = {
  code: string;
  name: string;
  description: string | null;
  permissions: string[];
  isSystemRole: boolean;
  isEditable: boolean;
  status: string;
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
