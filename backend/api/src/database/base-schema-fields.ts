import { COMMON_STATUS_VALUES } from './base-fields';

export const baseSchemaFields = {
  status: {
    type: String,
    enum: COMMON_STATUS_VALUES,
    default: 'active',
    index: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
} as const;
