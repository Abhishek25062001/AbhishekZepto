import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type { VendorMediaFile, VendorMediaUploadPayload } from '../types/vendor-media.types';

const BASE = '/api/v1/vendor/media';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

export const listVendorMediaFiles = async (page = 1, limit = 50) => {
  const response = await apiClient.get<ApiSuccessResponse<VendorMediaFile[]>>(`${BASE}/files`, {
    params: { page, limit },
  });
  return unwrapData(response.data);
};

export const uploadVendorMedia = async (file: File, payload: VendorMediaUploadPayload) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('filePurpose', payload.filePurpose);
  if (payload.ownerType) {
    formData.append('ownerType', payload.ownerType);
  }
  if (payload.ownerId) {
    formData.append('ownerId', payload.ownerId);
  }
  if (payload.isPublic !== undefined) {
    formData.append('isPublic', String(payload.isPublic));
  }

  const response = await apiClient.post<ApiSuccessResponse<VendorMediaFile>>(
    `${BASE}/upload`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return unwrapData(response.data);
};

export const deleteVendorMediaFile = async (mediaFileId: string) => {
  const response = await apiClient.delete<ApiSuccessResponse<VendorMediaFile>>(
    `${BASE}/files/${mediaFileId}`,
  );
  return unwrapData(response.data);
};
