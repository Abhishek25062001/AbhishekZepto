import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../../database/constants/collection-names.constants';
import { CITY_STATUS_VALUES } from '../constants/city-status.constant';

export type CityRecord = {
  name: string;
  slug: string;
  state: string;
  country: string;
  timezone: string;
  currencyCode: string;
  latitude: number | null;
  longitude: number | null;
  serviceRadiusKm: number | null;
  isServiceable: boolean;
  status: (typeof CITY_STATUS_VALUES)[number];
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

const CitySchema = new Schema<CityRecord>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'India' },
    timezone: { type: String, required: true, trim: true },
    currencyCode: { type: String, required: true, trim: true, uppercase: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    serviceRadiusKm: { type: Number, default: null },
    isServiceable: { type: Boolean, default: true },
    status: { type: String, enum: CITY_STATUS_VALUES, default: 'active' },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    isDeleted: baseSchemaFields.isDeleted,
    deletedAt: baseSchemaFields.deletedAt,
  },
  baseSchemaOptions as SchemaOptions<CityRecord>,
);

CitySchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
CitySchema.index({ status: 1 });
CitySchema.index({ isServiceable: 1 });
CitySchema.index({ isDeleted: 1 });
CitySchema.index({ createdAt: -1 });

export const CityModel = model<CityRecord>('City', CitySchema, COLLECTION_NAMES.CITIES);
