import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env';
import { STORAGE_PROVIDER } from '../modules/media/constants/storage-provider.constant';

export const ensureMediaUploadDirectory = async (): Promise<void> => {
  if (env.MEDIA_STORAGE_PROVIDER !== STORAGE_PROVIDER.LOCAL) {
    return;
  }

  const uploadDir = path.resolve(process.cwd(), env.MEDIA_LOCAL_UPLOAD_DIR);
  await fs.mkdir(uploadDir, { recursive: true });
};
