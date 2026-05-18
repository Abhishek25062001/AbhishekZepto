import { useMutation } from '@tanstack/react-query';

import { uploadAdminMedia } from '../api/media.api';
import type { MediaUploadPayload, MediaUploadResult } from '../types/media.types';

export function useMediaUpload() {
  return useMutation({
    mutationFn: async ({
      file,
      payload,
    }: {
      file: File;
      payload: MediaUploadPayload;
    }): Promise<MediaUploadResult> => {
      const media = await uploadAdminMedia(file, payload);
      return {
        mediaFileId: media.id,
        publicUrl: media.publicUrl,
      };
    },
  });
}
