import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type { MediaFileResponse, MediaUploadPayload } from '../types/media.types';
import { unwrapData } from '../utils/catalog-api.util';

const UPLOAD_PATH = '/api/v1/admin/media/upload';

export const uploadAdminMedia = async (file: File, payload: MediaUploadPayload) => {
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

  const response = await apiClient.post<ApiSuccessResponse<MediaFileResponse>>(UPLOAD_PATH, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return unwrapData(response.data);
};
