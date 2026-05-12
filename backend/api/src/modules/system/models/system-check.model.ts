import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';

export type SystemCheckRecord = {
  key: string;
  value: string;
  status: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const SystemCheckSchema = new Schema<SystemCheckRecord>(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    ...baseSchemaFields,
  },
  baseSchemaOptions as SchemaOptions<SystemCheckRecord>,
);

SystemCheckSchema.index({ key: 1 }, { unique: true });

export const SystemCheckModel = model<SystemCheckRecord>(
  'SystemCheck',
  SystemCheckSchema,
  COLLECTION_NAMES.SYSTEM_CHECKS,
);
