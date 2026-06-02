import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { ADMIN_ACTION_TYPE } from '../../admin-control/constants/admin-action-types';
import { writeAdminActionAudit } from '../../admin-control/services/admin-audit-log.service';
import {
  createAdminDataExportRecord,
  findAdminDataExportRecordById,
  listAdminDataExportRecords,
} from '../repositories/admin-data-export.repository';
import type {
  AdminDataExportRecord,
  AdminDataExportResponse,
  CreateAdminDataExportForAdminInput,
  ListAdminDataExportsInput,
} from '../types/admin-data-export.types';

export const mapAdminDataExport = (
  dataExport: AdminDataExportRecord,
): AdminDataExportResponse => ({
  id: dataExport._id.toString(),
  exportType: dataExport.exportType,
  format: dataExport.format,
  status: dataExport.status,
  filters: dataExport.filters,
  requestedByAdminId: dataExport.requestedByAdminId.toString(),
  requestedAt: dataExport.requestedAt,
  completedAt: dataExport.completedAt,
  failedAt: dataExport.failedAt,
  failureReason: dataExport.failureReason,
  fileKey: dataExport.fileKey,
  fileName: dataExport.fileName,
  downloadUrl: dataExport.downloadUrl,
  expiresAt: dataExport.expiresAt,
  createdAt: dataExport.createdAt,
  updatedAt: dataExport.updatedAt,
});

export const createAdminDataExportForAdmin = async ({
  reason,
  ipAddress,
  deviceInfo,
  ...input
}: CreateAdminDataExportForAdminInput): Promise<AdminDataExportResponse> => {
  const created = await createAdminDataExportRecord(input);
  const afterState = mapAdminDataExport(created);

  await writeAdminActionAudit({
    adminId: input.requestedByAdminId,
    actionType: ADMIN_ACTION_TYPE.ADMIN_DATA_EXPORT_CREATED,
    entityType: 'admin_data_export',
    entityId: created._id.toString(),
    beforeState: {},
    afterState,
    reason,
    ipAddress: ipAddress ?? null,
    deviceInfo: deviceInfo ?? null,
  });

  return afterState;
};

export const listAdminDataExportsForAdmin = async (
  input: ListAdminDataExportsInput,
) => {
  const { items, total } = await listAdminDataExportRecords(input);

  return {
    items: items.map(mapAdminDataExport),
    page: input.page,
    limit: input.limit,
    total,
  };
};

export const getAdminDataExportForAdmin = async (exportId: string) => {
  const dataExport = await findAdminDataExportRecordById(exportId);

  if (!dataExport) {
    throw new AppError({
      message: 'Admin data export not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.ADMIN_DATA_EXPORT_NOT_FOUND,
    });
  }

  return mapAdminDataExport(dataExport);
};
