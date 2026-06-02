import { Types } from 'mongoose';

import { PlatformSettingModel } from '../models/platform-setting.model';
import type {
  ListPlatformSettingsQuery,
  PlatformSettingValue,
} from '../types/platform-settings.types';

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const findPlatformSettingByKey = (settingKey: string) => {
  return PlatformSettingModel.findOne({ key: settingKey.trim() }).exec();
};

export const listPlatformSettingRecords = async ({
  category,
  scopeType,
  scopeId,
  search,
  page,
  limit,
}: ListPlatformSettingsQuery) => {
  const filter: Record<string, unknown> = {};

  if (category) filter.category = category;
  if (scopeType) filter.scopeType = scopeType;
  if (scopeId) filter.scopeId = scopeId;

  if (search?.trim()) {
    const pattern = escapeRegex(search.trim());
    filter.$or = [
      { key: { $regex: pattern, $options: 'i' } },
      { description: { $regex: pattern, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    PlatformSettingModel.find(filter).sort({ category: 1, key: 1 }).skip(skip).limit(limit).exec(),
    PlatformSettingModel.countDocuments(filter).exec(),
  ]);

  return { items, total };
};

export const updatePlatformSettingValueRecord = ({
  settingKey,
  value,
  adminId,
}: {
  settingKey: string;
  value: PlatformSettingValue;
  adminId: string;
}) => {
  return PlatformSettingModel.findOneAndUpdate(
    { key: settingKey.trim(), isEditable: true },
    {
      $set: {
        value,
        updatedBy: Types.ObjectId.isValid(adminId) ? new Types.ObjectId(adminId) : null,
      },
    },
    { new: true },
  ).exec();
};
