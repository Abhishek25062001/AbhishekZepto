import { Types } from 'mongoose';

import { ADMIN_DATA_EXPORT_STATUS } from '../constants/admin-data-export.constants';
import { AdminDataExportModel } from '../models/admin-data-export.model';
import type {
  AdminDataExportRecord,
  CreateAdminDataExportInput,
  ListAdminDataExportsInput,
} from '../types/admin-data-export.types';

const toObjectId = (value: string): Types.ObjectId => new Types.ObjectId(value);

const buildAdminDataExportFilter = ({
  exportType,
  format,
  status,
  requestedByAdminId,
  fromDate,
  toDate,
}: ListAdminDataExportsInput): Record<string, unknown> => {
  const filter: Record<string, unknown> = {};

  if (exportType) {
    filter.exportType = exportType;
  }

  if (format) {
    filter.format = format;
  }

  if (status) {
    filter.status = status;
  }

  if (requestedByAdminId) {
    filter.requestedByAdminId = toObjectId(requestedByAdminId);
  }

  if (fromDate || toDate) {
    filter.requestedAt = {
      ...(fromDate ? { $gte: fromDate } : {}),
      ...(toDate ? { $lte: toDate } : {}),
    };
  }

  return filter;
};

export const createAdminDataExportRecord = async ({
  exportType,
  format,
  filters,
  requestedByAdminId,
}: CreateAdminDataExportInput): Promise<AdminDataExportRecord> => {
  const created = await AdminDataExportModel.create({
    exportType,
    format,
    status: ADMIN_DATA_EXPORT_STATUS.QUEUED,
    filters,
    requestedByAdminId: toObjectId(requestedByAdminId),
    requestedAt: new Date(),
  });

  return created.toObject() as AdminDataExportRecord;
};

export const listAdminDataExportRecords = async (
  input: ListAdminDataExportsInput,
): Promise<{ items: AdminDataExportRecord[]; total: number }> => {
  const filter = buildAdminDataExportFilter(input);
  const skip = (input.page - 1) * input.limit;

  const [items, total] = await Promise.all([
    AdminDataExportModel.find(filter)
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(input.limit)
      .lean()
      .exec(),
    AdminDataExportModel.countDocuments(filter).exec(),
  ]);

  return { items: items as AdminDataExportRecord[], total };
};

export const findAdminDataExportRecordById = async (
  exportId: string,
): Promise<AdminDataExportRecord | null> => {
  if (!Types.ObjectId.isValid(exportId)) {
    return null;
  }

  return AdminDataExportModel.findById(exportId).lean().exec() as Promise<AdminDataExportRecord | null>;
};
