import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { ADMIN_ACTION_TYPE } from '../../admin-control/constants/admin-action-types';
import { AdminActionAuditModel } from '../../admin-control/models/admin-action-audit.model';
import { writeAdminActionAudit } from '../../admin-control/services/admin-audit-log.service';
import { PLATFORM_SETTING_VALUE_TYPE } from '../constants/platform-settings.constants';
import {
  findPlatformSettingByKey,
  listPlatformSettingRecords,
  updatePlatformSettingValueRecord,
} from '../repositories/platform-setting.repository';
import type {
  ListPlatformSettingsQuery,
  PlatformSettingDocument,
  PlatformSettingRecord,
  PlatformSettingValue,
  UpdatePlatformSettingInput,
} from '../types/platform-settings.types';

export const mapPlatformSetting = (
  setting: PlatformSettingDocument | PlatformSettingRecord,
) => ({
  id: setting._id.toString(),
  key: setting.key,
  category: setting.category,
  value: setting.value,
  valueType: setting.valueType,
  scopeType: setting.scopeType,
  scopeId: setting.scopeId ?? null,
  description: setting.description,
  isSensitive: setting.isSensitive,
  isEditable: setting.isEditable,
  updatedBy: setting.updatedBy?.toString() ?? null,
  createdAt: setting.createdAt,
  updatedAt: setting.updatedAt,
});

export const getPlatformSettingOrThrow = async (settingKey: string) => {
  const setting = await findPlatformSettingByKey(settingKey);

  if (!setting) {
    throw new AppError({
      message: 'Platform setting not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.PLATFORM_SETTING_NOT_FOUND,
    });
  }

  return setting;
};

export const listPlatformSettingsForAdmin = async (
  input: ListPlatformSettingsQuery,
) => {
  const { items, total } = await listPlatformSettingRecords(input);

  return {
    items: items.map(mapPlatformSetting),
    page: input.page,
    limit: input.limit,
    total,
  };
};

export const getPlatformSettingForAdmin = async (settingKey: string) => {
  const setting = await getPlatformSettingOrThrow(settingKey);
  return mapPlatformSetting(setting);
};

const isValueCompatibleWithType = (
  value: PlatformSettingValue,
  valueType: PlatformSettingRecord['valueType'],
) => {
  if (valueType === PLATFORM_SETTING_VALUE_TYPE.BOOLEAN) {
    return typeof value === 'boolean';
  }

  if (valueType === PLATFORM_SETTING_VALUE_TYPE.NUMBER) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  if (valueType === PLATFORM_SETTING_VALUE_TYPE.STRING) {
    return typeof value === 'string';
  }

  return value !== undefined;
};

export const updatePlatformSettingForAdmin = async ({
  settingKey,
  value,
  reason,
  adminId,
  ipAddress,
  deviceInfo,
}: UpdatePlatformSettingInput) => {
  const setting = await getPlatformSettingOrThrow(settingKey);

  if (!setting.isEditable) {
    throw new AppError({
      message: 'Platform setting is not editable',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.PLATFORM_SETTING_NOT_EDITABLE,
    });
  }

  if (!isValueCompatibleWithType(value, setting.valueType)) {
    throw new AppError({
      message: 'Platform setting value does not match the configured value type',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: ERROR_CODES.PLATFORM_SETTING_VALUE_TYPE_INVALID,
    });
  }

  const beforeState = mapPlatformSetting(setting);
  const updated = await updatePlatformSettingValueRecord({
    settingKey,
    value,
    adminId,
  });

  if (!updated) {
    throw new AppError({
      message: 'Platform setting not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.PLATFORM_SETTING_NOT_FOUND,
    });
  }

  const afterState = mapPlatformSetting(updated);

  await writeAdminActionAudit({
    adminId,
    actionType: ADMIN_ACTION_TYPE.PLATFORM_SETTING_UPDATED,
    entityType: 'platform_setting',
    entityId: setting._id.toString(),
    beforeState,
    afterState,
    reason,
    ipAddress: ipAddress ?? null,
    deviceInfo: deviceInfo ?? null,
  });

  return afterState;
};

export const listPlatformSettingAuditForAdmin = async (settingKey: string) => {
  const setting = await getPlatformSettingOrThrow(settingKey);

  return AdminActionAuditModel.find({
    entityType: 'platform_setting',
    entityId: setting._id,
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean()
    .exec();
};
