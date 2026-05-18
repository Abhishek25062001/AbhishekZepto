import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../../database/constants/collection-names.constants';
import { SERVICE_AREA_STATUS_VALUES } from '../constants/service-area-status.constant';

export type ServiceAreaRecord = {
  cityId: Types.ObjectId;
  name: string;
  slug: string;
  description: string | null;
  polygon: unknown[] | null;
  centerLatitude: number | null;
  centerLongitude: number | null;
  radiusKm: number | null;
  isServiceable: boolean;
  status: (typeof SERVICE_AREA_STATUS_VALUES)[number];
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

const ServiceAreaSchema = new Schema<ServiceAreaRecord>(
  {
    cityId: { type: Schema.Types.ObjectId, required: true, ref: 'City' },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, default: null, trim: true },
    polygon: { type: [Schema.Types.Mixed], default: null },
    centerLatitude: { type: Number, default: null },
    centerLongitude: { type: Number, default: null },
    radiusKm: { type: Number, default: null },
    isServiceable: { type: Boolean, default: true },
    status: { type: String, enum: SERVICE_AREA_STATUS_VALUES, default: 'active' },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    isDeleted: baseSchemaFields.isDeleted,
    deletedAt: baseSchemaFields.deletedAt,
  },
  baseSchemaOptions as SchemaOptions<ServiceAreaRecord>,
);

ServiceAreaSchema.index(
  { cityId: 1, slug: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
ServiceAreaSchema.index({ cityId: 1 });
ServiceAreaSchema.index({ status: 1 });
ServiceAreaSchema.index({ isServiceable: 1 });
ServiceAreaSchema.index({ isDeleted: 1 });
ServiceAreaSchema.index({ createdAt: -1 });

export const ServiceAreaModel = model<ServiceAreaRecord>(
  'ServiceArea',
  ServiceAreaSchema,
  COLLECTION_NAMES.SERVICE_AREAS,
);
